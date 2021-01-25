
const PDFDocument = require("pdfkit")


//https://pdfkit.org
const profile = {
    name: "Lorsis",
    lastName: "Cuntreri",
    email: "loris@gmail.com",
    image: "",
    experiences: [{
        name: "Google",
        position: "Intern"
    },
    {
        name: "Uber",
        position: "Junior Frontend Developer"
    },
    ]
}

const generateCV = (profile) => {

    const doc = new PDFDocument;

    doc.fontSize(25).text(profile.name, 100, 100)
    doc.fontSize(25).text(profile.lastName, 100, 100)

    return doc;
}



module.exports = { generateCV }