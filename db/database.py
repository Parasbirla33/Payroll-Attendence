"""Engine/session setup and DB initialization."""
from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from config import settings
from db.models import Base, CompanyConfig

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def init_db() -> None:
    """Create tables if they don't exist and seed the singleton CompanyConfig row."""
    Base.metadata.create_all(engine)
    with SessionLocal() as session:
        if session.get(CompanyConfig, 1) is None:
            session.add(CompanyConfig(id=1))
            session.commit()


def get_session() -> Session:
    return SessionLocal()


# Run once automatically on first import of this module, so tables exist
# regardless of which page a user lands on first (not every page/deep-link
# necessarily goes through app.py's explicit init_db() call).
init_db()
