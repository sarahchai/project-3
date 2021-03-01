const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Contact } = require('./models');
const path = require('path');

const PORT = process.env.PORT || 5678;
const jwtSecret = 'remembermesos757'

const app = express();

app.use(bodyParser.json());

app.use("/", express.static("./build/"));

app.post('/api/register', async(request, response) => {
  if (!request.body.userEmail || !request.body.password) {
    response.status(400).json({
      message: 'Both user email and password should be filled in.'
    })
    return
  }

  const checkUserEmail = await User.findOne({
    where: {
      userEmail: request.body.userEmail
    }
  })

  if (checkUserEmail) {
    response.status(409).json({
      message: 'The user email has been used.'
    })
    return
  }

  const saltRounds = 12;
  const hashPassword = await bcrypt.hash(
    request.body.password,
    saltRounds
  );

  const newUser = await User.create({
    userEmail: request.body.userEmail,
    passwordDigest: hashPassword
  })

  const jwtToken = jwt.sign({ userId: newUser.id }, jwtSecret);
  response.status(200).json(jwtToken);
})

app.post('/api/login', async (request, response) => {
  if (!request.body.userEmail || !request.body.password) {
    response.status(400).json({
      message: 'The user email and password is invalid'
    })
    return;
  }

  const userInfo = await User.findOne({
    where: {
      userEmail: request.body.userEmail
    }
  })

  if (userInfo === null) {
    response.status(401).json({
      message: 'Invalid user email'
    })
  }

  const checkPassword = await bcrypt.compare(request.body.password, userInfo.passwordDigest);

  if (checkPassword) {
    const jwtToken = jwt.sign({ userId: userInfo.id }, jwtSecret);
    response.json(jwtToken);
  } else {
    response.status(409).json({
      message: 'The user email and password does not match'
    })
  }
})

app.get('/api/current-user', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
  const currentUser = await User.findOne({
    where: {
      id: verify.userId
    }
  })
  response.json({
    userId: currentUser.id
  })
});

app.post('/api/contacts', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
  const {name, contactInfo, whereYouMet, importance, linkedInFriends, conversationDetails} = request.body
  const contact = await Contact.create({
    name: name,
    contactInfo: contactInfo,
    whereYouMet: whereYouMet,
    importance: importance,
    linkedInFriends: linkedInFriends,
    conversationDetails: conversationDetails,
    userId: verify.userId
  });
  response.status(200).json(contact)
});

app.get('/api/current-user/contacts', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
 
  const contacts = await Contact.findAll({
    order: [['id', 'DESC']],
    where: {userId: verify.userId }
  });
  response.json(contacts)
})

app.get('/api/current-user/contacts/important', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);
 
  const contacts = await Contact.findAll({
    order: [['importance', 'DESC']],
    where: {userId: verify.userId }
  });
  response.json(contacts)
})

app.get('/api/contacts/:id', async (request, response) => {
  let id = request.params.id
  const idContact = await Contact.findOne({
    where: {
      id: id
    }
  })
  response.json(idContact)
})

app.put('/api/contacts/:id', async (request, response) => {
  let id = request.params.id;
  const contactEdit = await Contact.findOne({
    where: {
      id: id
    }
  })
  const { name, contactInfo, whereYouMet, importance, conversationDetails, linkedInFriends } = request.body
  contactEdit.name = name 
  contactEdit.contactInfo = contactInfo
  contactEdit.whereYouMet = whereYouMet
  contactEdit.importance = importance
  contactEdit.conversationDetails = conversationDetails
  contactEdit.linkedInFriends = linkedInFriends
  await contactEdit.save();
  
  response.json(contactEdit);
})

app.delete("/api/contacts/:id", async (request, response) => {
  const id = request.params.id 
  const deleteConatact = await Contact.destroy({
    where: {
      id: id
    }
  });
  response.status(200).json(deleteConatact);
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

if (process.env.NODE_ENV == "production") {
  app.get("/*", function(request, response) {
    response.sendFile(path.join(__dirname, "build", "index.html"));
  });
}
