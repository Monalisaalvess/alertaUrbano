const mongoose = require ('mongoose');
const ReportSchema = new mongoose.Schema({

    title: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      minlength: [5, 'Título deve ter pelo menos 5 caracteres'],
      maxlength: [100, 'Título deve ter no máximo 100 caracteres'],
    },

    description: {
      type: String,
      required: [true, 'Descrição é obrigatória'],
      minlength: [10, 'Descrição deve ter pelo menos 10 caracteres'],
      maxlength: [1500, 'Descrição deve ter no máximo 1500 caracteres'],
    },

    category: {
      type: String,
      enum: ['buraco', 'iluminacao', 'lixo', 'saneamento', 'seguranca', 'outro'],
      required: [true, 'Categoria é obrigatória'],
    },

    location: {
      
        address: {
        type: String,
        required: [true, 'Endereço é obrigatório'],
        trim: true,
      },

      neighborhood: {
        type: String,
        required: [true, 'Bairro é obrigatório'],
        trim: true,
      },

    },

    image: {
      type: String,
      required: [true, 'Imagem é obrigatória'],
    },

    status: {
      type: String,
      enum: ['pendentes', 'analise', 'resolvidas', ],
      default: 'pendentes',
    },

    likes: {
      type: Number,
      default: 0,
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    reposts: {
      type: Number,
      default: 0,
    },

    repostedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    adminComment: {
      type: String,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    
  },
  {
    timestamps: true,
  }
);

ReportSchema.index({ 'location.neighborhood': 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ category: 1 });

module.exports = mongoose.model('Report', ReportSchema);

