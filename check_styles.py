import urllib.request
import re
from html.parser import HTMLParser

class HeaderParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h1 = False
        self.h1_classes = None
        self.h1_text = ""

    def handle_starttag(self, tag, attrs):
        if tag == "h1":
            self.in_h1 = True
            for name, value in attrs:
                if name == "class":
                    self.h1_classes = value

    def handle_endtag(self, tag):
        if tag == "h1":
            self.in_h1 = False

    def handle_data(self, data):
        if self.in_h1:
            self.h1_text += data

def check_styles():
    print("=== Checking Local Deno Fresh Server ===")
    try:
        # 1. Fetch the tutorial page
        with urllib.request.urlopen("http://localhost:8000/tutorial", timeout=2.0) as response:
            html = response.read().decode('utf-8')
        
        # 2. Parse the H1 header
        parser = HeaderParser()
        parser.feed(html)
        
        print(f"Parsed Header Text   : '{parser.h1_text.strip()}'")
        print(f"Parsed Header Classes: '{parser.h1_classes}'")
        
        # 3. Check for specific classes
        has_red = "text-red-600" in (parser.h1_classes or "")
        has_underline = "underline" in (parser.h1_classes or "")
        
        if has_red and has_underline:
            print("✔ SUCCESS: The HTML output has the correct classes (red-600 & underline).")
        else:
            print("✘ WARNING: The HTML output does not match the expected test classes.")
            
        # 4. Fetch and verify stylesheet
        with urllib.request.urlopen("http://localhost:8000/styles.css", timeout=2.0) as response:
            css = response.read().decode('utf-8')
            
        if ".text-red-600" in css:
            print("✔ SUCCESS: '.text-red-600' class is present in the compiled stylesheet.")
        else:
            print("✘ WARNING: '.text-red-600' class is missing from the stylesheet.")
            
    except Exception as e:
        print(f"Error connecting/checking: {e}")
        print("Please make sure the Deno server is currently running on http://localhost:8000")

if __name__ == "__main__":
    check_styles()
