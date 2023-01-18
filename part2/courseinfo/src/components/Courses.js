const Header = ({ course }) => <h2>{course.name}</h2>

const Part = ({ part, exercise }) => <p>{part} {exercise}</p>

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

const Total = ({ parts }) => {
  const total = parts.reduce((part, currentV) => {
    return part + currentV.exercises
  }, 0)

  return (
    <strong>Total of {total} exercises</strong>
  )
}

const Course = ({ courses, curriculum }) => {
  return (
    <>
      <h1>{curriculum}</h1>
      <div>{
        courses.map((course) => {
          return <div key={course.id}>
            <Header course={course} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
        })
      }</div>
    </>
  )
}

export default Course