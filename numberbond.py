import random
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def draw_number_bond(c, x, y, whole, part1, part2, radius=20, spacing=50, choice=None):
    """Draw a number bond diagram with one whole and two parts."""
    if choice is None:
        choice = random.choice(["whole", "left", "right"])  # which circle is blank?

    # Whole circle
    c.circle(x, y, radius)
    if choice == "whole":
        c.drawCentredString(x, y - 5, "")
    else:
        c.drawCentredString(x, y - 5, str(whole))

    # Part circles
    left_x, left_y = x - spacing, y - 60
    right_x, right_y = x + spacing, y - 60
    c.circle(left_x, left_y, radius)
    c.circle(right_x, right_y, radius)

    if choice == "left":
        c.drawCentredString(left_x, left_y - 5, "")
        c.drawCentredString(right_x, right_y - 5, str(part2))
    elif choice == "right":
        c.drawCentredString(left_x, left_y - 5, str(part1))
        c.drawCentredString(right_x, right_y - 5, "")
    else:  # whole blank
        c.drawCentredString(left_x, left_y - 5, str(part1))
        c.drawCentredString(right_x, right_y - 5, str(part2))

    # Connect lines
    c.line(x, y - radius, left_x, left_y + radius)
    c.line(x, y - radius, right_x, right_y + radius)

    return choice  # tell caller which value was blank


def generate_number_bonds(n_problems=36, filename="number_bonds.pdf"):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    y = height - 80
    c.setFont("Courier", 18)
    c.drawCentredString(width / 2, height - 40, "Number Bonds Worksheet")

    c.setFont("Courier", 16)

    for i in range(1, n_problems + 1):
        # Ensure sums stay <= 10
        whole = random.randint(2, 10)
        part1 = random.randint(1, whole - 1)
        part2 = whole - part1

        # Choose one blank for both diagram and sentences
        blank = random.choice(["whole", "left", "right"])

        # Draw number bond diagram
        c.drawString(50, y + 25, f"{i}.")
        draw_number_bond(c, 150, y, whole, part1, part2, spacing=50, choice=blank)

        # Draw number sentences on the right side
        if blank == "whole":
            sentences = [
                f"{part1} + {part2} = ___",
                f"{part2} + {part1} = ___"
            ]
        elif blank == "left":
            sentences = [
                f"___ + {part2} = {whole}",
                f"{whole} - {part2} = ___"
            ]
        else:  # right blank
            sentences = [
                f"{part1} + ___ = {whole}",
                f"{whole} - {part1} = ___"
            ]

        text_y = y + 0
        for s in sentences:
            c.drawString(280, text_y, s)
            text_y -= 50

        y -= 120
        if y < 100:
            c.showPage()
            y = height - 80
            c.setFont("Courier", 16)

    c.save()


if __name__ == "__main__":
    generate_number_bonds()
