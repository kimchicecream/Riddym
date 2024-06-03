import './Note.css';

const Note = ({ onDragStart }) => {
    return (
        <div
            className="note"
            draggable
            onDragStart={onDragStart}
        >
            🎵
        </div>
    );
}

export default Note;
