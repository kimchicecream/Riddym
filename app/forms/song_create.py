from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, FileField
from wtforms.validators import DataRequired, NumberRange
from flask_wtf.file import FileAllowed, FileRequired
from app.api.aws_helper import ALLOWED_EXTENSIONS_MP3, ALLOWED_EXTENSIONS_IMG

class SongForm(FlaskForm):
    song_name = StringField('song_name', validators=[DataRequired()])
    duration = IntegerField('Duration', validators=[DataRequired(), NumberRange(min=1)])
    song_file = FileField('Song File', validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS_MP3))])
    image_file = FileField('Image File', validators=[FileAllowed(list(ALLOWED_EXTENSIONS_IMG))])
    artist_name = StringField('Artist Name', validators=[DataRequired()])
    submit = SubmitField('submit')
