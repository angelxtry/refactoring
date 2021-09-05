import {invoices} from "./invoices.js";
import {plays} from './plays.js';

const statement = (invoice, plays) => {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format;

  function amountFor(perf) {
    let result = 0;

    switch (playFor(perf).type) {
      case "tragedy":
        result = 40000;
        if (perf.audience > 30) {
          result += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (perf.audience > 20) {
          result += 10000 + 500 * (perf.audience - 20);
        }
        result += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(perf).type}`);
    }
    return result;
  }

  function playFor(perf) {
    return plays[perf.playID];
  }

  for (let perf of invoice.performances) {
    volumeCredits += Math.max(perf.audience - 30, 0);

    if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

    result += `${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience}석)\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result
}

console.log(statement(invoices, plays));
