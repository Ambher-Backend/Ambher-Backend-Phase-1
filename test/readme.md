#### What are specs? :thinking:

A spec, short for specification, comes from behavior driven testing, and encourages the mindset where you are defining 'what' the software does.

#### Why specs? :unamused:

So specs are the heart and soul of test-driven development, specs are way to test your code by creating expected behavior and then running that code.
Advantages:

1. A tested code is less prone to errors and is expected to work well in a production environment.
2. You don't want your code to break in front of clients.
3. CI(continuous integration is only as good as the tests being run in it)
4. If the code you wrote is covered with specs **broke somehow**, then you have a valid argument that your code is fine, there
   can be some other issues

### Notes:

1. Scope(trigger) of every `[before, after, beforeEach, afterEach]` is to the (most nearby)**describe** in which it is defined.
1. `beforeEach` block is triggered before each `it` block, here you can do the **initialization work required before execution** of the `it` block.
1. `afterEach` block is triggered after each `it` block, here you can do the **cleanup work required after execution** of for the `it` block.
1. `before` block is defined in a `describe` scope and is triggered **only once** before execution of the first `it` block under the corresponding `describe`.
1. `after` block is defined in a `describe` scope and is triggered **only after** execution of all `it` blocks under the corresponding `describe`.
1. Always write a `after/afterEach` for a `before/beforeEach` to avoid complications in other test suites.

Example:(read the comments carefully)

```
describe("Testing some condition", async () => {
  /*
    id -> 1
  */
  beforeEach(async () => {
    //..some initialization work
  });

  /*
    id -> 1
    This will be triggered before all the its (which are defined in the current describe scope)
  */
  before(async () => {
    // some initialization work.
  })

  // beforeEach(id: 1) and before(id: 1) will be executed before this block's execution
  it("some validating condition", async () => {
    // using variables, values of which are assigned in the beforeEach block
  });

  // beforeEach(id: 1) will be executed before this block's execution
  it("some validating condition-2", async () => {
    // using variables, values of which are assigned in the beforeEach block
  });

  describe("Testing some nested/dependent condition", async () => {
    /*
      id -> 2
    */
    beforeEach(async () => {
      //..some initialization work
    });

    /*
      id -> 2
    */
    before(async () => {
      //..some initialization work
    });

    // beforeEach(id: 1), beforeEach(id: 2), before(id: 2) will be executed before this block's execution
    it("some validating condition", async () => {
      // using variables, values of which are assigned in the beforeEach block
    });

    // beforeEach(id: 1), beforeEach(id: 2) will be executed before this block's execution
    it("some validating condition-2", async () => {
      // using variables, values of which are assigned in the beforeEach block
    });
  });
});
```

> Same flow is applicable for `after` and `afterEach` blocks
