var Path = require("path");

var Tmp = require("./tmp");
var Err = require("../src/_error");
var Private = require("../src/_private");


// Helper to catch specific exceptions.
var it2 = function(msg, fnc) {
  return it(msg, function() {
    try {
      fnc();
    }
    catch( ex ) {
      if( typeof ex.msg === 'string' ) {
        fail( ex.msg );
      } else {
        fail( JSON.stringify( ex, null, '  ' ) );
      }
    }
  });
};


describe('_private', function() {
  describe('normalizePath', function() {
    describe('should throw POSIX_EXPECTED', function() {
      ["A/B\\C"].forEach(function (path) {
        it('with "' + path + '"', function() {
          try {
            Private.normalizePath( path );
            fail( "Exception expected!" );
          }
          catch( ex ) {
            expect( ex.id ).toBe( Err.POSIX_EXPECTED );
          }
        });
      });
    });

    describe('should throw OUT_OF_BOUNDS', function() {
      ["../A", "A/../..", "A/B/../C/../../../D"].forEach(function (path) {
        it('with "' + path + '"', function() {
          try {
            Private.normalizePath( path );
            fail( "Exception expected!" );
          }
          catch( ex ) {
            expect( ex.id ).toBe( Err.OUT_OF_BOUNDS );
          }
        });
      });
    });

    describe('should simplify path', function() {
      [
        ["A/B/C"],
        ["A/B/./C", "A/B/C"],
        ["./A/B/C", "A/B/C"],
        ["./A/./B/C", "A/B/C"],
        ["./A/./B/./C", "A/B/C"],
        ["./././A/B/./C", "A/B/C"],
        ["A/../B", "B"],
        ["A/..", ""],
        ["A/../B/../C/D/E/..", "C/D"]
      ].forEach(function (arg) {
        var [input, expected] = arg;
        if( typeof expected === 'undefined' ) expected = input;
        it2('"' + input + '"', function() {
          expect( Private.normalizePath( input ) ).toBe( expected );
        });
      });
    });
  });

  describe('getAllAbsPaths', function() {
    it2('should produce a simple path', function() {
      if( Path.sep === '/' ) {
        // POSIX.
        expect(Private.getAllAbsPaths(
          {_roots:{src:["/home/foo"]}},
          "src/sources/bar"
        )).toEqual(["/home/foo/sources/bar"]);
      } else {
        // WINDOWS.
        expect(Private.getAllAbsPaths(
          {_roots:{src:["C:\\projects\\sources"]}},
          "src/sources/bar"
        )).toEqual(["C:\\projects\\sources\\sources\\bar"]);
      }
    });

    it2('should produce a simple path with tailing slash in the root', function() {
      if( Path.sep === '/' ) {
        // POSIX.
        expect(Private.getAllAbsPaths(
          {_roots:{src:["/home/foo/"]}},
          "src/sources/bar"
        )).toEqual(["/home/foo/sources/bar"]);
      } else {
        // WINDOWS.
        expect(Private.getAllAbsPaths(
          {_roots:{src:["C:\\projects\\sources\\"]}},
          "src/sources/bar"
        )).toEqual(["C:\\projects\\sources\\sources\\bar"]);
      }
    });
  });

  describe('getAbsPath', function() {
    it2('should produce a simple path', function() {
      if( Path.sep === '/' ) {
        // POSIX.
        expect(Private.getAbsPath(
          {_roots:{src:["/home/foo"]}},
          "src/sources/bar"
        )).toBe("/home/foo/sources/bar");
      } else {
        // WINDOWS.
        expect(Private.getAbsPath(
          {_roots:{src:["C:\\projects\\sources"]}},
          "src/sources/bar"
        )).toBe("C:\\projects\\sources\\sources\\bar");
      }
    });

    it2('should produce a simple path with tailing slash in the root', function() {
      if( Path.sep === '/' ) {
        // POSIX.
        expect(Private.getAbsPath(
          {_roots:{src:["/home/foo/"]}},
          "src/sources/bar"
        )).toBe("/home/foo/sources/bar");
      } else {
        // WINDOWS.
        expect(Private.getAbsPath(
          {_roots:{src:["C:\\projects\\sources\\"]}},
          "src/sources/bar"
        )).toBe("C:\\projects\\sources\\sources\\bar");
      }
    });
  });

  describe('splitPath', function() {
    it('should throw UNKNOWN_ROOT', function() {
      try {
        Private.splitPath( { _roots: {} }, "src/data" );
        fail("Missing exception!");
      }
      catch( ex ) {
        expect( ex.id ).toBe( Err.UNKNOWN_ROOT );
      }
    });

    it2('should ignore heading slashes', function() {
      var [root, path] = Private.splitPath(
        { _roots: {src: [
          "/home/toto/sources"
        ]} },
        "/////src/pacman/levels/level-one.dat"
      );
      expect(root.length).toBe(1);
      expect(root[0]).toBe("/home/toto/sources");
      expect(path).toBe("pacman/levels/level-one.dat");
    });

    it2('should split arrays roots', function() {
      var [root, path] = Private.splitPath(
        { _roots: {src: [
          "/home/toto/sources", "C:\\projects\\sources"
        ]} },
        "src/pacman/levels/level-one.dat"
      );
      expect(root.length).toBe(2);
      expect(root[0]).toBe("/home/toto/sources");
      expect(root[1]).toBe("C:\\projects\\sources");
      expect(path).toBe("pacman/levels/level-one.dat");
    });

    it2('should split a simple path (POSIX)', function() {
      var [root, path] = Private.splitPath(
        { _roots: {src: ["/home/toto/sources"]} },
        "src/pacman/levels/level-one.dat"
      );
      expect(root.length).toBe(1);
      expect(root[0]).toBe("/home/toto/sources");
      expect(path).toBe("pacman/levels/level-one.dat");
    });

    it2('should split a simple path (WIN)', function() {
      var [root, path] = Private.splitPath(
        { _roots: {src: ["C:\\projects\\sources"]} },
        "src/pacman/levels/level-one.dat"
      );
      expect(root.length).toBe(1);
      expect(root[0]).toBe("C:\\projects\\sources");
      expect(path).toBe("pacman/levels/level-one.dat");
    });
  });

  describe('checkRootsDefinitions', function() {
    it('should throw BAD_ROOT_DEFINITION', function() {
      try {
        Private.checkRootsDefinitions({ src: 25 });
        fail("Missing exception!");
      }
      catch( ex ) {
        expect( ex.id ).toBe( Err.BAD_ROOT_DEFINITION );
      }
    });
    
    it('should throw DIRECTORY_NOT_FOUND', function() {
      try {
        Private.checkRootsDefinitions({ src: "/unknown/path/666" });
        fail("Missing exception!");
      }
      catch( ex ) {
        expect( ex.id ).toBe( Err.DIRECTORY_NOT_FOUND );
      }
    });

    it2('should convert string into array', function() {
      var roots = { src: Tmp.path };
      Private.checkRootsDefinitions( roots );
      expect( roots.src ).toEqual([ Tmp.path ]);
    });

  });
});
