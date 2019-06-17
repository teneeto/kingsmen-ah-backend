import sinon from 'sinon';
import { validateArticle } from '@validations/auth';
import { validateRatings } from '@validations/rating';
import { findAllArticle, findArticle } from '@helpers/articlePayload';
import ArticleController from '@controllers/articles';
import { exceptions } from 'winston';


describe('ArticleController', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle creation of new articles', async () => {
    const stubFunc = { validateArticle };
    sandbox.stub(stubFunc, 'validateArticle').rejects('Oops');

    const next = sinon.spy();
    await ArticleController.create({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle update of articles', async () => {
    const stubFunc = { validateArticle };
    sandbox.stub(stubFunc, 'validateArticle').rejects('Oops');

    const next = sinon.spy();
    await ArticleController.update({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle rating of articles', async () => {
    const stubFunc = { validateRatings };
    sandbox.stub(stubFunc, 'validateRatings').rejects('Oops');

    const next = sinon.spy();
    await ArticleController.rate({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle no slug passed to delete article', async () => {
    const next = sinon.spy();
    await ArticleController.delete({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle no slug passed to get one article', async () => {
    const next = sinon.spy();
    await ArticleController.getOne({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle cannot get all articles', async () => {
    const stubFunc = { findAllArticle };
    sandbox.stub(stubFunc, 'findAllArticle').rejects('Oops');

    const next = sinon.spy();
    await ArticleController.getAll({}, {}, next);
    sinon.assert.calledOnce(next);
  });

  it('should handle cannot get one article', async () => {
    const articleId = sinon.spy();
    const stubFunc = { findArticle };
    sandbox.stub(stubFunc, 'findArticle').rejects('Oops');
    findArticle({ articleId });
    sinon.assert.exceptions;
  });
});
