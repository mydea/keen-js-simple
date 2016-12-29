import globalKeen from '../../src/keen-js-simple';

describe('keen', () => {
  describe('Options work', () => {

    it('should have the correct default options', () => {
      let keen = globalKeen;
      let options = keen.options;

      expect(typeof options).to.equal('object');
      expect(options.projectId).to.equal(null);
      expect(options.writeKey).to.equal(null);
      expect(options.queueTime).to.equal(5000);
      expect(options.baseURL).to.equal('https://api.keen.io/3.0/projects');
    });

    it('should allow changing of single options', () => {
      let keen = globalKeen.createInstance();
      let options = keen.options;

      expect(typeof options).to.equal('object');
      expect(options.projectId).to.equal(null);
      expect(options.writeKey).to.equal(null);
      expect(options.queueTime).to.equal(5000);
      expect(options.baseURL).to.equal('https://api.keen.io/3.0/projects');

      keen.setOptions({
        projectId: 'test1'
      });

      expect(keen.options.projectId).to.equal('test1');
      expect(keen.options.writeKey).to.equal(null);

      keen.setOptions({
        writeKey: 'test2'
      });

      expect(keen.options.projectId).to.equal('test1');
      expect(keen.options.writeKey).to.equal('test2');
    });

    it('should allow chaning of multiple options', () => {
      let keen = globalKeen.createInstance();

      let postFunc = function() {
      };

      let mergeDataFunc = function() {
      };

      keen.setOptions({
        projectId: 'test1',
        writeKey: 'test2',
        queueTime: 3000,
        baseURL: 'test3',
        post: postFunc,
        mergeData: mergeDataFunc
      });

      let options = keen.options;

      expect(typeof options).to.equal('object');
      expect(options.projectId).to.equal('test1');
      expect(options.writeKey).to.equal('test2');
      expect(options.queueTime).to.equal(3000);
      expect(options.baseURL).to.equal('test3');
      expect(options.post).to.equal(postFunc);
      expect(options.mergeData).to.equal(mergeDataFunc);
    });

  });
});
