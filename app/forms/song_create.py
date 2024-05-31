from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class SongForm(FlaskForm):
    song_name = StringField('song_name', validators=[DataRequired()])
    duration = IntegerField('duration', validators=[DataRequired()], NumberRange(min=1))
    song_url = StringField('song_url', validators=[DataRequired()])
    image_url = StringField('image_url', validators=[DataRequired()])
    artist_name = StringField('artist_name', validators=[DataRequired()])
    submit = SubmitField('submit')
