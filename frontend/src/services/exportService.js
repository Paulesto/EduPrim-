import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const exportService = {

  exportStudentsPDF: (students, schoolName = 'EduPrim') => {
    const doc = new jsPDF()

    // Header
    doc.setFillColor(29, 78, 216)
    doc.rect(0, 0, 210, 35, 'F')

    // Logo text
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('EduPrim', 14, 15)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Plateforme de gestion des écoles primaires', 14, 23)

    // School name
    doc.setFontSize(10)
    doc.text(schoolName, 14, 30)

    // Date
    const today = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
    doc.text(`Généré le ${today}`, 210 - 14, 30, { align: 'right' })

    // Title
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Liste des élèves', 14, 48)

    // Stats bar
    const garcons = students.filter(s => s.sexe === 'M').length
    const filles = students.filter(s => s.sexe === 'F').length

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(`Total : ${students.length} élève(s)   |   Garçons : ${garcons}   |   Filles : ${filles}`, 14, 55)

    // Table
    autoTable(doc, {
      startY: 60,
      head: [['#', 'Nom', 'Prénom', 'Sexe', 'Date de naissance', 'Classe', 'Contact parent']],
      body: students.map((s, i) => [
        i + 1,
        s.nom,
        s.prenom,
        s.sexe === 'M' ? 'Masculin' : 'Féminin',
        s.date_naissance,
        s.classroom?.nom || '—',
        s.contact_parent,
      ]),
      headStyles: {
        fillColor: [29, 78, 216],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [30, 41, 59],
      },
      alternateRowStyles: {
        fillColor: [239, 246, 255],
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 18, halign: 'center' },
        4: { cellWidth: 32, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
        6: { cellWidth: 35 },
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Footer sur chaque page
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(
          `Page ${data.pageNumber} / ${pageCount}`,
          210 / 2, 290, { align: 'center' }
        )
        doc.text('© EduPrim — Confidentiel', 14, 290)
      }
    })

    // Save
    doc.save(`liste-eleves-${new Date().toISOString().split('T')[0]}.pdf`)
  },

  exportTeachersPDF: (teachers, schoolName = 'EduPrim') => {
    const doc = new jsPDF()

    // Header
    doc.setFillColor(29, 78, 216)
    doc.rect(0, 0, 210, 35, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('EduPrim', 14, 15)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Plateforme de gestion des écoles primaires', 14, 23)
    doc.text(schoolName, 14, 30)

    const today = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
    doc.text(`Généré le ${today}`, 210 - 14, 30, { align: 'right' })

    doc.setTextColor(30, 41, 59)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Liste des enseignants', 14, 48)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(`Total : ${teachers.length} enseignant(s)`, 14, 55)

    autoTable(doc, {
      startY: 60,
      head: [['#', 'Nom', 'Prénom', 'Email', 'Téléphone']],
      body: teachers.map((t, i) => [
        i + 1,
        t.nom,
        t.prenom,
        t.email,
        t.telephone,
      ]),
      headStyles: {
        fillColor: [29, 78, 216],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [30, 41, 59],
      },
      alternateRowStyles: {
        fillColor: [239, 246, 255],
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages()
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(
          `Page ${data.pageNumber} / ${pageCount}`,
          210 / 2, 290, { align: 'center' }
        )
        doc.text('© EduPrim — Confidentiel', 14, 290)
      }
    })

    doc.save(`liste-enseignants-${new Date().toISOString().split('T')[0]}.pdf`)
  },
}

export default exportService