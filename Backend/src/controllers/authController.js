//const { Resend } = require('resend')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

//const resend = new Resend(process.env.RESEND_API_KEY);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.API_URL}/api/auth/verify/${token}`;

 await resend.emails.send({
    from: 'alertaurbanocrato@gmail.com',
    to: email, 
    subject: 'Confirme seu email - alertaUrbano',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #030f48;">Bem-vindo ao alertaUrbano!</h2>
        <p>Clique no botão abaixo para confirmar seu email:</p>
        <a href="${verificationUrl}" 
          style="display: inline-block; padding: 12px 24px; background-color: #030f48; 
          color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Confirmar Email
        </a>
        <p style="color: #666; font-size: 14px;">Este link expira em 24 horas.</p>
        <p style="color: #666; font-size: 14px;">Se você não criou uma conta, ignore este email.</p>
      </div>
    `,
  });
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
          return res.status(400).json({error:'Nome, email e senha são obrigatórios'})
        }
        if(password.length < 6){
          return res.status(400).json({error: 'Senha deve ter pelo menos 6 caracteres'})
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await User.create({
        name,
        email,
        password,
        verificationToken,
        verificationTokenExpires,
    });
    try{
      await sendVerificationEmail(email, verificationToken);
      } catch (emailErr) {
      console.log("Falha ao enviar email:", emailErr)
      return res.status(201).json({
      message: 'Cadastro realizado, mas houve um problema ao enviar o email. Tente reenviar.',
        emailError: true,
      });
    }

      res.status(201).json({
      message: 'Cadastro realizado com sucesso. Verifique seu email para ativar sua conta.',
    });

  } catch (err){
    console.log('Erro no regiter', err);
    res.status(500).json({error: err.message});
  };
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.json({ message: 'Email confirmado com sucesso! Você já pode fazer login.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Confirme seu email antes de fazer login.' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
    });
  } catch (err) {
    console.error("ERRO AQUI:", err); 
    res.status(500).json({ error: err.message });
  }

};

module.exports = { register, verifyEmail, login, getMe };