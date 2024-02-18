export default class Api {
  static async deal() {
    const resp = await fetch("/api/v1/deal");
    const card = await resp.json();
    return card;
  }

  static async deck(id) {
    if (typeof id === "undefined") {
      // here we assume we want to create a new deck
      const resp = await fetch("/api/v2/deck/new", { method: "POST" });
      const response = await resp.json();
      return response;
    } else if (typeof id === "string") {
      const resp = await fetch(`/api/v2/deck/${id}`);
      const response = await resp.json();
      return response;
    }
    throw new Error(`expected string, received ${typeof id}`);
  }

  static async dealV2(id, numberOfCards) {
    if (typeof id !== "string" || typeof numberOfCards !== "number") {
      throw new Error(
        "dealV2 requires a deck id and a number representing how many cards should be dealt"
      );
    }

    let response = await fetch(
      `/api/v2/deck/${id}/deal?count=${numberOfCards}`
    );

    let drawnCards = await response.json();
    return drawnCards;
  }

  static async discard(id, cards) {
    const response = await fetch(`/api/v2/deck/${id}/discard/~${cards}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to discard cards");
    }

    return await response.json();
  }

  static async highestRank(hand) {
    const resp = await fetch(`/api/v2/highestRank/~${hand}`);
    const rank = await resp.json();
    console.log(rank.message);
    return rank.message;
  }
}
