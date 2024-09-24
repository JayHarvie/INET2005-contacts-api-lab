import express from 'express';
import multer from 'multer';

const router = express.Router();

// Multersetup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/'); // save uploaded files in `public/images` folder
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();// get file extension
        const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext; // generate unique filename - current timestamp + random number between 0 and 1000.
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage: storage});

router.get('/', (req, res) => {
  res.send('Contacts route with an automatic update');
});

// Get all contacts
router.get('/all', async (req, res) => {
    const contacts = await Prisma.contact.findMany();

    res.send(contacts);
});
  
// Get a contact by id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.send('Contact by id ' + id);
});

// to-do: add post, put, and delete routers

// creating a post router
router.post('/create', upload.single('image'), async (req, res) => {
    const { firstName, lastName, phone, email, title } = req.body;
    const fileName = req.file ? req.file.filename : null;

    // validate inputs
    if(!firstName || !lastName || !phone || !email) {
        res.status(400).send('Required fields must have a value.');
        return;
    }

    const contact = await Prisma.contact.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            title: title,
            phone: phone,
            email: email,
            filename:fileName
        }
    });

    res.json(contact);
});

// creating an update router
router.put('/update/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;

    if (req.file) {
        console.log('file uploaded' + req.file.filename);
    }
});

// creating a delete router
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    res.send("Deleting contact id: " + id);
    
});
  
export default router;