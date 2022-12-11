const STATUS_CODE = require('../errors/errorCodes');
const NotFoundError = require('../errors/NotFoundError');
const Cards = require('../models/card');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(STATUS_CODE.serverError)
      .send({ message: `Произошла ошибка на сервере: ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODE.badRequest).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: `Произошла ошибка на сервере: ${err.message}` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.remove({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError('Карточка по указанному _id не найдена');
    })
    .then((response) => res.send(response))
    .catch((err) => {
      if (err.name === 'notFound') {
        res.status(STATUS_CODE.notFound).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res
          .status(STATUS_CODE.badRequest)
          .send({ message: 'Передан не корректный _id карточки' });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: `Произошла ошибка на сервере: ${err}` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществтвующий _id карточки');
    })
    .then((response) => res.send(response))
    .catch((err) => {
      if (err.name === 'notFound') {
        res.status(STATUS_CODE.notFound).send({ message: err.message });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(STATUS_CODE.badRequest)
          .send({
            message: 'Переданы некорректные данные для постановки лайка.',
          });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: `Произошла ошибка на сервере: ${err}` });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществтвующий _id карточки');
    })
    .then((response) => res.send(response))
    .catch((err) => {
      if (err.name === 'notFound') {
        res.status(STATUS_CODE.notFound).send({ message: err.message });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(STATUS_CODE.badRequest)
          .send({
            message: 'Переданы некорректные данные для снятия лайка.',
          });
      } else {
        res
          .status(STATUS_CODE.serverError)
          .send({ message: `Произошла ошибка на сервере: ${err}` });
      }
    });
};
