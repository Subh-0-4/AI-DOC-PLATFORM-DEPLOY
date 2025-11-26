# backend/app/routers/projects.py

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db              # ✅ correct source of get_db
from .. import models, schemas
from ..auth import get_current_user
from ..services.llm_service import llm_service

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
)


@router.post("/", response_model=schemas.ProjectOut)
def create_project(
    project_in: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # Create the project
    project = models.Project(
        name=project_in.name,
        document_type=project_in.document_type,
        main_topic=project_in.main_topic,
        owner_id=current_user.id,
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Create sections with AI-generated initial content
    for sec in project_in.sections:
        section = models.Section(
            project_id=project.id,
            order_index=sec.order_index,
            title=sec.title,
        )

        # 🔹 AI initial generation
        ai_text = llm_service.generate_section(
            main_topic=project_in.main_topic,
            section_title=sec.title,
        )
        section.content = ai_text

        db.add(section)

    db.commit()
    db.refresh(project)
    return project


@router.get("/", response_model=List[schemas.ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    projects = (
        db.query(models.Project)
        .filter(models.Project.owner_id == current_user.id)
        .all()
    )
    return projects


@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    project = (
        db.query(models.Project)
        .filter(
            models.Project.id == project_id,
            models.Project.owner_id == current_user.id,
        )
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
