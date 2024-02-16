export default class Api {
  static async deal() {
    const resp = await fetch("/api/v1/deal");
    const card = await resp.json();
    return card;
  }

  static async deck(id) {
    // while testing things out, you can override response to be whatever you want
    console.log(id);
    if (typeof id === "undefined") {
      // here we assume we want to create a new deck
      const resp = await fetch("/api/v2/deck/new", { method: "POST" });
      const response = await resp.json();
      console.log(response);
      return response;
    } else if (typeof id === "string") {
      // the default method for fetch is GET
      const resp = await fetch(`/api/v2/deck/${id}`);
      const response = await resp.json();
      console.log(response);
      return response;
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

    let response = await fetch(
      `/api/v2/deck/${id}/deal?count=${numberOfCards}`
    );

    console.log(response);
    let drawnCards = await response.json();
    console.log(drawnCards);

    return drawnCards;
  }

  static async highestRank(hand) {
    const resp = await fetch("/api/v2/highestRank");

    const rank = await resp.json();
    return rank;
  }
}
