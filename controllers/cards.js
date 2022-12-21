const BadRequestError = require('../errors/BadRequestError');
const FrobiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Cards = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки.',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findById({ _id: cardId })
    .orFail(() => {
      next(new NotFoundError('Карточка по указанному _id не найдена'));
    })
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        Cards.remove({ _id: cardId })
          .then(() => {
            res.send(card);
          })
          .catch(next);
      } else {
        next(new FrobiddenError('Нет прав для удаления карточки'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан не корректный _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка.',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError('Передан несуществтвующий _id карточки'));
    })
    .then((response) => res.send(response))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError('Переданы некорректные данные для снятия лайка.'),
        );
      } else {
        next(err);
      }
    });
};
