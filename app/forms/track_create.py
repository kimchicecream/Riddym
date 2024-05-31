from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange

class TrackForm(FlaskForm)
    song_id = IntegerField('song_id', validators=[DataRequired()])
    difficulty = StringField('difficulty', validators=[DataRequired()])
    duration = IntegerField('duration', validators=[DataRequired(), NumberRange(min=1)])
    submit = SubmitField('submit')
