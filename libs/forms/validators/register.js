const { body } = require('express-validator')

const registerValidationRules = () => {

  return [
    // L'utilisateur ne doit pas être vide.
    body('loginRegister').notEmpty(),
    //L'e-mail doit être un e-mail...
    body('emailRegister').isEmail(),
    // Le mot-de-passe doit dépasser les cinq cararctères.
    body('passwordRegister').isLength({ min: 5 })
  ]
}

module.exports = registerValidationRules;
