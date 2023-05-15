import { test } from './index';

describe('test', () => {
  it('adds text to body', () => {
    test();
    expect(document.body.innerHTML).toBe('I am alive');
  })
})