import { useDispatch } from 'react-redux'
import { filterAnecdote } from '../reducers/filterReducer'
// import { useSelector } from 'react-redux'

const Filter = () => {
  const dispatch = useDispatch()
  // const state_check = useSelector(state => state)

  const style = {
    marginBottom: 10
  }

  const handleChange = (event) => {
    // console.log(state_check)
    dispatch(filterAnecdote(event.target.value))
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
