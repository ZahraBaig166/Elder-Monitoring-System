# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base

# DB_USER = "postgres"
# DB_PASS = "Zahra166"
# DB_HOST = "localhost"
# DB_NAME = "routine"

# DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(bind=engine)
# Base = declarative_base()
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_USER = "postgres"
DB_PASS = "laiba"
DB_HOST = "localhost"
DB_PORT = "5432"
DATABASE_NAME = 'ElderlyMonitoring'

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DATABASE_NAME}"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()
