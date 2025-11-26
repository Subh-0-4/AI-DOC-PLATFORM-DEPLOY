# backend/app/routers/sections.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db          # ✅ get_db comes from database, not auth
from ..auth import get_current_user
from ..services.llm_service import llm_service

router = APIRouter(prefix="/sections", tags=["sections"])


def _get_section_or_404(section_id: int, db: Session, current_user: models.User) -> models.Section:
    section = (
        db.query(models.Section)
        .join(models.Project)
        .filter(
            models.Section.id == section_id,
            models.Project.owner_id == current_user.id,
        )
        .first()
    )
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


@router.get("/{section_id}", response_model=schemas.Section)
def get_section(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    section = _get_section_or_404(section_id, db, current_user)
    return section


# ---------- Refinement ----------

@router.post("/{section_id}/refine", response_model=schemas.Section)
def refine_section(
    section_id: int,
    refinement_in: schemas.RefinementCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    section = _get_section_or_404(section_id, db, current_user)

    project = section.project
    old_content = section.content or ""

    # Call LLM service to generate new content
    new_content = llm_service.refine_text(
        original=old_content,
        refinement_prompt=refinement_in.prompt,
        section_title=section.title,
        main_topic=project.main_topic,
    )

    # Store refinement history
    refinement = models.Refinement(
        section_id=section.id,
        prompt=refinement_in.prompt,
        old_content=old_content,
        new_content=new_content,
    )

    # Update section content to latest
    section.content = new_content

    db.add(refinement)
    db.commit()
    db.refresh(section)     # ✅ refresh section, since that's what we return

    return section          # ✅ return updated section instead of refinement


# ---------- Feedback (like / dislike) ----------

@router.post("/{section_id}/feedback")
def give_feedback(
    section_id: int,
    payload: schemas.FeedbackRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    section = (
        db.query(models.Section)
        .filter(models.Section.id == section_id)
        .first()
    )
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")

    # Only update if these columns exist on the model
    if hasattr(section, "likes") and hasattr(section, "dislikes"):
        if payload.is_like:
            section.likes = (section.likes or 0) + 1
        else:
            section.dislikes = (section.dislikes or 0) + 1
        db.commit()
        db.refresh(section)

    return {"ok": True}


# ---------- Comments ----------

@router.post("/{section_id}/comments", response_model=schemas.CommentOut)
def add_comment(
    section_id: int,
    comment_in: schemas.CommentBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    section = _get_section_or_404(section_id, db, current_user)

    comment = models.Comment(
        section_id=section.id,
        text=comment_in.text,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.get("/{section_id}/comments", response_model=List[schemas.CommentOut])
def list_comments(
    section_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    section = _get_section_or_404(section_id, db, current_user)
    return section.comments
