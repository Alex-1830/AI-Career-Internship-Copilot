
from pypdf import PdfReader
from io import BytesIO

def extract_resume_text(file_content):

    pdf = PdfReader(BytesIO(file_content))

    text = ""

    for page in pdf.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text
