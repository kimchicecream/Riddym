from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField
from app.api.aws_helper import ALLOWED_EXTENSIONS_MP3, ALLOWED_EXTENSIONS_IMG

class MP3Form(FlaskForm):
    image = FileField("MP3 File", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS_MP3))])
    submit = SubmitField("Upload MP3")

class ImageForm(FlaskForm):
    image = FileField("Image File", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS_IMG))])
    submit = SubmitField("Upload Image")
