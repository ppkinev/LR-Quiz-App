const text = () => `Sport: 1. When you place your first bet of £10/10€ or more we will give you 2 x £10 free bets. 2. You must stake a minimum of £10/10€ on your first bet. 3. Your first bet must be placed on a selection(s) with single/cumulative odds greater than 1/2 (1.5). 4. For Each Way bets, only the win part counts towards the F20 promotion. E.g. £5 E/W (total stake £10) would not qualify for the promotion, however a minimum of £10 E/W (total stake £20) would trigger the 2x£10 free bets. 5. The free bet will be awarded upon placement of qualifying bet. 6. This offer is only available to new William Hill customers who open an account using a valid promo code. 7. Duplicate accounts will not qualify for this offer. Only 'one new account offer' per person, household address, email address, debit/credit card number, or IP address is allowed. 8. Due to the abuse of free bet promotions, customers using Skrill, Skrill 1-Tap, Neteller or PaySafe to deposit will not qualify for any free bet sign-up offer. 9. TApplies to new accounts opened in the UK only using GBP currency. 10.

Casino: 1. Terms and Conditions Apply. 2. New customers only. 3. Wagering applies (Deposit + Bonus x20), restrictions apply, see details here. 4. Bonus and winnings will be removed if withdrawal or transfer is made before wagering completion. 5. Deposit up to £150, get a 100% bonus. Deposits up to £10,000 get a £300 bonus.

Live Casino: 1. New customers only. 2. Once you have deposited more than £25 into your William Hill Account you need to turn it over 8 times (total stake £200 or more). 3. Once you have met the turn requirement you need to contact our Customer Services team (see below) who will credit your William Hill account with £25 (or currency equivalent). 4. The New Player Bonus only applies to William Hill Live Casino and any play on William Hill Vegas does not count towards your Bonus. 5. Bets which will not count towards your New Player Bonus can be seen here.

Vegas: 1. New to Vegas customers only: This Promotion is only available to players who have not placed a real money bet on William Hill Vegas (Online or Mobile) prior to entering this Promotion. Existing William Hill online or mobile customers (for example, sports betting customers) who have never wagered on William Hill Vegas will also be eligible. 2. The promotion is only available once per player. 3. This bonus is only available to players residing in the UK with a GBP currency account. 4. The minimum buy in amount is £10. 5. The buy in amount will be combined with the bonus amount and will show as a separate Bonus Balance of up to £200. 6. Bonus Balance is available to play on any Vegas game excluding those listed within the terms and conditions. 7. Bonus Balance will not be available on other William Hill tabs until the bonus has been wagered 30 times. Once the players has bought into the bonus, wagering requirement will be visible on the promotion page. 8. During the wagering period, any winnings will be added to the Bonus balance. 9. Bonus can be cancelled at any time. Please note that the bonus plus any winnings will be deducted during cancellation and player will be notified of the amount that will be returned into the main balance. 10. Once the bonus has been fully wagered, any remaining Bonus Balance will become available to withdraw or play on any William Hill product. For full Terms and Conditions click here.

Bingo: 1. Offer available for new customers only. 2. Spend £10 cash on bingo tickets within 7 days of your first visit. 3. The £50 bonus will automatically be paid into your account and will be split as a £40 Bingo Bonus and £10 Games Bonus. 4. The Bingo and Games bonus is non-withdrawable. There is a x20 wagering requirement on the Games Bonus before winnings can be withdrawn.

`.replace(/\n/g, '<br/>');

const mailto = 'mailto:?to=&subject=some%20subject&body=some%20body';
const sms = 'sms:';

const partners = [
	{
		partnerId: 1,
		name: 'Coral',
		// picture: require('./images/betpartner.png'),
    // picture: '/content/matchquiz/images/bet-partner.png',
		// picture: '//static.rewarded.club/content/matchquiz/images/partner-picture.png',
		text: text(),
		signupLink: 'http://ads2.williamhill.com/redirect.aspx?pid=191305103&lpid=1487410973&bid=1487410351',
		privacyLink: '//coral-eng.custhelp.com/app/answers/detail/a_id/2132/~/privacy-policy',
		facebookLink: '//facebook.com',
		mailtoLink: mailto,
		smsLink: sms,
	},
	/*{
		 partnerId: 2,
		 name: 'Sky bet',
		 picture: require("../../static/images/partner-picture2.png"),
		 text: text('Sky Bet'),
		 signupLink: 'http://affiliatehub.skybet.com/processing/clickthrgh.asp?btag=a_19010b_2',
		 privacyLink: '//support.skybet.com/app/answers/detail/a_id/143/~/privacy-and-cookies-notice',
		 facebookLink: '//facebook.com',
		 mailtoLink: mailto,
		 smsLink: sms,
	 }*/
];


export default partners;
