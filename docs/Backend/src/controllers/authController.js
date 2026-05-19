const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.API_URL}/api/auth/verify/${token}`;

  await transporter.sendMail({
    from: `"alertaUrbano" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Confirme seu email - alertaUrbano',

    //supunheto q essas linhas estão erradas 
    html: ` 
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Bem-vindo ao alertaUrbano!</h2>
            <p>Clique no botão abaixo para confirmar seu email:</p>
        
        <a href="${verificationUrl}" 
          style="display: inline-block; padding: 12px 24px; background-color: #16a34a; 
          color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Confirmar Email
        </a>
            <p style="color: #666; font-size: 14px;">Este link expira em 24 horas.</p>
            <p style="color: #666; font-size: 14px;">Se você não criou uma conta, ignore este email.</p>
      </div>
    `,
  });
};

// POST
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

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

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: 'Cadastro realizado com sucesso. Verifique seu email para ativar sua conta.',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET
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

// POST 

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

// GET
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
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, verifyEmail, login, getMe };