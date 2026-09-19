import json
from pathlib import Path

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_mistralai import MistralAIEmbeddings
from dotenv import load_dotenv

load_dotenv()


# =========================================================
# CONFIG
# =========================================================

BASE_DIR = Path(__file__).parent

CHROMA_DIR = BASE_DIR / "chroma_db"


embeddings = MistralAIEmbeddings(
    model="mistral-embed"
)


# =========================================================
# CONVERT AGENT RESPONSE TO JSON
# =========================================================

def make_json(analysis_result) -> dict:
    """
    Converts LangChain analysis agent response into
    a clean JSON-serializable dictionary.
    """

    messages = analysis_result.get("messages", [])

    if not messages:
        raise ValueError("Analysis agent returned no messages.")

    # Find the final AI response
    final_message = None

    for message in reversed(messages):
        if getattr(message, "type", None) == "ai":
            final_message = message
            break

    if final_message is None:
        raise ValueError("No AI response found.")

    content = final_message.content

    # Sometimes content may already be structured
    if isinstance(content, dict):
        return content

    # If model returned JSON string
    if isinstance(content, str):

        try:
            return json.loads(content)

        except json.JSONDecodeError:

            # Keep normal text as a JSON object
            return {
                "analysis": content
            }

    return {
        "analysis": str(content)
    }


# =========================================================
# STORE ANALYSIS IN CHROMA
# =========================================================

def run_db(json_content: dict):

    vector_store = Chroma(
        collection_name="dataset_analysis",
        embedding_function=embeddings,
        persist_directory=str(CHROMA_DIR)
    )

    documents = []

    for section, content in json_content.items():

        documents.append(
            Document(
                page_content=json.dumps(
                    content,
                    indent=2,
                    ensure_ascii=False
                ),
                metadata={
                    "source": "analysis_agent",
                    "section": section
                }
            )
        )

    vector_store.add_documents(documents)

    return vector_store


# =========================================================
# LOAD CHROMA
# =========================================================

def load_context():
    """
    Loads the existing Chroma database.
    """

    vector_store = Chroma(
        collection_name="dataset_analysis",
        embedding_function=embeddings,
        persist_directory=str(CHROMA_DIR)
    )

    return vector_store


# =========================================================
# RETRIEVE ANALYSIS
# =========================================================

def retrieve_context(query: str, k: int = 5):
    """
    Retrieves relevant analysis information from Chroma.
    """

    vector_store = load_context()

    documents = vector_store.similarity_search(
        query,
        k=k
    )

    return documents


# =========================================================
# GET CONTEXT AS STRING
# =========================================================

def get_context(query: str, k: int = 2):

    documents = retrieve_context(query, k)

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    print("=" * 60)
    print("RETRIEVED DOCUMENTS:", len(documents))
    print("CONTEXT CHARACTERS:", len(context))
    print("ESTIMATED TOKENS:", len(context) // 4)
    print("=" * 60)

    return context