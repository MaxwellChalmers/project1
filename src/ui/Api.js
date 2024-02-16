export default class Api {
  static async deal() {
    const resp = await fetch("/api/v1/deal");
    const card = await resp.json();
    return card;
  }

  static async deck(id) {
    // while testing things out, you can override response to be whatever you want
    if (typeof id === "undefined") {
      // here we assume we want to create a new deck
      const resp = await fetch("/api/v2/deck/new", { method: "POST" });
      const response = await resp.json();
      return "response";
    } else if (typeof id === "string") {
      // the default method for fetch is GET
      const resp = await fetch(`/api/v2/deck/${id}`);
      const response = await resp.json();
      return "response";
    }

    throw new Error(`expected string, received ${typeof id}`);
  }

  static async dealV2(id, numberOfCards) {
    // while testing things out, you can override response to be whatever you want

    if (typeof id !== "string" || typeof numberOfCards !== "number") {
      throw new Error(
        "dealV2 requires a deck id and a number representing how many cards should be dealt"
      );
    }

    let drawnCards  = await fetch(`/api/v2/deck/${id}/deal?count={numberOfCards}`)
   /** const cards = await Promise.all(
      /

         This is some wacky functional programming magic. It's bad
         code, but you should practice understanding it.  Essentially,
         we're creating a new array of the appropriate length, then
         mapping over it to create an array of Promises, which we then
         await.

         Once API v2 is created, we can delete this and change it to a
         much simpler single API call that specifies the number of
         cards we want dealt.

       
      Array.from(Array(count).keys()).map((arg, index) => {
        return Api.deal();
      })
      

    ); **/

    return drawnCards;
  }

  static async highestRank(hand) {
    const resp = await fetch("/api/v2/highestRank");

    const rank = await resp.json();
    return rank;
  }
}
