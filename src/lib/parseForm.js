import { IncomingForm } from 'formidable'

export function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      keepExtensions: true,
      multiples: false,
    })

    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}
