import { getStudents, getTeachers } from './sheets'

export async function detectRole(accessToken, userEmail) {
  const [students, teachers] = await Promise.all([
    getStudents(accessToken),
    getTeachers(accessToken)
  ])

  const isTeacher = teachers.some(t => t.email.toLowerCase() === userEmail.toLowerCase())
  if (isTeacher) return { role: 'teacher', profile: null, students }

  const studentProfile = students.find(s => s.email.toLowerCase() === userEmail.toLowerCase())
  if (studentProfile) return { role: 'student', profile: studentProfile, students: null }

  return { role: 'unknown', profile: null, students: null }
}