var Tmp = require("./tmp");
var Index = require("../src/index.js");


describe('Index', function() {
  describe('mkdir', function() {
    it('should create direct folder', function(){
      return new Promise(function (resolve, reject) {
        console.log("[direct] Clear");
        Tmp.clear();
        var fs = new Index({ roots: { tmp: Tmp.path } });
        fs.mkdir("tmp/direct").then(function() {
          expect(true).toBe(true);
          console.log("[direct] Done!");
          resolve();
        }, function(err) {
          fail(err);
          reject(err);
        });
      });
    });

    it('should create a depth folder', function(){
      return new Promise(function (resolve, reject) {
        console.log("[depht] Clear");
        Tmp.clear();
        var fs = new Index({ roots: { tmp: Tmp.path } });
        fs.mkdir("tmp/depth/BBB/CCC/AAA").then(function() {
          expect(true).toBe(true);
          console.log("[depht] done!");
          resolve();
        }, function(err) {
          fail(err);
          reject(err);
        });
      });
    });
  });

  describe('Constructor', function() {
    describe('should throw exception fs-1', function() {
      it('for empty argument', function() {
        try {
          var fs = new Index();
          fail("Exception not thrown!");
        }
        catch( ex ) {
          expect( ex.id ).toEqual( "fs-1" );
        }
      });
      it('if args.root is not defined', function() {
        try {
          var fs = new Index({});
          fail("Exception not thrown!");
        }
        catch( ex ) {
          expect( ex.id ).toEqual( "fs-1" );
        }
      });
      it('if args.root is not an object', function() {
        try {
          var fs = new Index({ roots: "/var/log" });
          fail("Exception not thrown!");
        }
        catch( ex ) {
          expect( ex.id ).toEqual( "fs-1" );
        }
      });
      it('if args.root is an array', function() {
        try {
          var fs = new Index({ roots: [] });
          fail("Exception not thrown!");
        }
        catch( ex ) {
          expect( ex.id ).toEqual( "fs-1" );
        }
      });
    });

    describe('should throw exception fs-2', function() {
      it('if roots is not an object', function() {
        try {
          var fs = new Index({ roots: { src: { foo: "bar" } } });
          fail("Exception not thrown!");
        }
        catch( ex ) {
          expect( ex.id ).toEqual( "fs-2" );
        }
      });
    });

    describe('should throw exception fs-3', function() {
      it('if a directory does not exist', function() {
        try {
          var fs = new Index({ roots: { src: "/invalid/directory" } });
          fail("Exception not thrown!");
        }
        catch( ex ) {
          expect( ex.id ).toEqual( "fs-3" );
        }
      });
    });
  });
});
