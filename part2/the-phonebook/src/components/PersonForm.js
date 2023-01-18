const PersonForm = (props) => {
    return (
        <form onSubmit={props.onSubmit}>
            <div>
                name: <input value={props.newName} onChange={props.onNameChange}></input>
            </div>
            <div>
                number: <input value={props.newNum} onChange={props.onNumChange}></input>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm