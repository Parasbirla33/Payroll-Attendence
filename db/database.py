"""Engine/session setup and DB initialization."""
from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from config import settings
from db.models import Base, CompanyConfig

# SQLAlchemy 2.x rejects the legacy "postgres://" scheme some providers
# (including Supabase's older docs/tooling) still hand out; normalize it.
_database_url = settings.database_url
if _database_url.startswith("postgres://"):
    _database_url = _database_url.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    _database_url,
    connect_args={"check_same_thread": False} if _database_url.startswith("sqlite") else {},
    # Postgres connections can be silently dropped by the provider after
    # idling (Supabase does this); pre-ping avoids "connection closed"
    # errors on the first query after a gap instead of surfacing them to users.
    pool_pre_ping=not _database_url.startswith("sqlite"),
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
