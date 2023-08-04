import { useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from 'react-bootstrap'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div >
      <div style={hideWhenVisible}>
        <Button className='m-1' type='primary' size='sm' onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>

      <div style={showWhenVisible}>
        {props.children}
        <Button size='sm' onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Toggleable'

export default Togglable
