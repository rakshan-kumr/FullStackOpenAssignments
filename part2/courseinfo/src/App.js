const Header = ({ course }) => <h1>{course.name}</h1>

const Content = ({ parts }) => {
  return (
    <div>
      {
        parts.map((part) => <Part
          key={part.id}
          part={part.name}
          exercise={part.exercises} />)
      }
    </div>
  )
}
const Part = ({ part, exercise }) => <p>{part} {exercise}</p>

const Total = ({ parts }) => {
  const total = parts.reduce((part, currentV) => {
    return part + currentV.exercises
  }, 0)

  return (
    <strong>Total of {total} exercises</strong>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />

    </>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      },
      {
        name: 'Next Exercise for testing',
        exercises: 21,
        id: 5
      }
    ]
  }

  return <Course course={course} />
}

export default App