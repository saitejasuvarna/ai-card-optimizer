// Complete database of popular credit cards with local image paths
const CREDIT_CARDS_DATABASE = [
    // Chase Cards
    { name: "Chase Sapphire Preferred", issuer: "Chase", id: "chase_sapphire_preferred", image: "images/chase_sapphire_preferred.png" },
    { name: "Chase Sapphire Reserve", issuer: "Chase", id: "chase_sapphire_reserve", image: "images/chase_sapphire_reserve.png" },
    { name: "Chase Freedom Unlimited", issuer: "Chase", id: "chase_freedom_unlimited", image: "images/chase_freedom_unlimited.png" },
    { name: "Chase Freedom Flex", issuer: "Chase", id: "chase_freedom_flex", image: "images/chase_freedom_flex.png" },
    { name: "Chase Freedom Rise", issuer: "Chase", id: "chase_freedom_rise", image: "images/chase_freedom_rise.png" },
    { name: "Chase Amazon Prime Rewards", issuer: "Chase", id: "chase_amazon_prime", image: "images/chase_amazon_prime.png" },
    { name: "Chase World of Hyatt", issuer: "Chase", id: "chase_hyatt", image: "images/chase_hyatt.png" },
    { name: "Chase United Explorer", issuer: "Chase", id: "chase_united_explorer", image: "images/chase_united_explorer.png" },
    { name: "Chase United Gateway", issuer: "Chase", id: "chase_united_gateway", image: "images/chase_united_gateway.png" },
    { name: "Chase United Club Business", issuer: "Chase", id: "chase_united_club_business", image: "images/chase_united_club_business.png" },
    { name: "Chase United Club Infinite", issuer: "Chase", id: "chase_united_club_infinite", image: "images/chase_united_club_infinite.png" },
    { name: "Chase United Quest", issuer: "Chase", id: "chase_united_quest", image: "images/chase_united_quest.png" },
    { name: "Chase Marriott Bonvoy Boundless", issuer: "Chase", id: "chase_marriott", image: "images/chase_marriott.png" },
    { name: "Chase Marriott Bonvoy Bold", issuer: "Chase", id: "chase_marriott_bold", image: "images/chase_marriott_bold.png" },
    { name: "Chase Southwest Rapid Rewards Plus", issuer: "Chase", id: "chase_southwest_plus", image: "images/chase_southwest_plus.png" },
    { name: "Chase Southwest Rapid Rewards Premier", issuer: "Chase", id: "chase_southwest_premier", image: "images/chase_southwest_premier.png" },
    { name: "Chase Southwest Rapid Rewards Priority", issuer: "Chase", id: "chase_southwest_priority", image: "images/chase_southwest_priority.png" },
    { name: "Chase IHG Rewards Premier", issuer: "Chase", id: "chase_ihg_premier", image: "images/chase_ihg_premier.png" },
    { name: "Chase IHG Rewards Traveler", issuer: "Chase", id: "chase_ihg_traveler", image: "images/chase_ihg_traveler.png" },
    { name: "Chase British Airways Visa", issuer: "Chase", id: "chase_british_airways", image: "images/chase_british_airways.png" },
    { name: "Chase Aeroplan Card", issuer: "Chase", id: "chase_aeroplan", image: "images/chase_aeroplan.png" },
    { name: "Chase Disney Premier Visa", issuer: "Chase", id: "chase_disney_premier", image: "images/chase_disney_premier.png" },
    { name: "Chase Disney Visa", issuer: "Chase", id: "chase_disney", image: "images/chase_disney.png" },
    { name: "Chase Ink Business Preferred", issuer: "Chase", id: "chase_ink_preferred", image: "images/chase_ink_preferred.png" },
    { name: "Chase Ink Business Cash", issuer: "Chase", id: "chase_ink_cash", image: "images/chase_ink_cash.png" },
    { name: "Chase Ink Business Unlimited", issuer: "Chase", id: "chase_ink_unlimited", image: "images/chase_ink_unlimited.png" },
    { name: "Chase Ink Business Premier", issuer: "Chase", id: "chase_ink_premier", image: "images/chase_ink_premier.png" },
    { name: "Chase Starbucks Rewards Visa", issuer: "Chase", id: "chase_starbucks", image: "images/chase_starbucks.png" },
    { name: "Chase DoorDash Rewards Mastercard", issuer: "Chase", id: "chase_doordash", image: "images/chase_doordash.png" },
    { name: "Chase Instacart Mastercard", issuer: "Chase", id: "chase_instacart", image: "images/chase_instacart.png" },
    
    // American Express Cards  
    { name: "American Express Platinum Card", issuer: "American Express", id: "amex_platinum", image: "images/amex_platinum.png" },
    { name: "American Express Gold Card", issuer: "American Express", id: "amex_gold", image: "images/amex_gold.png" },
    { name: "American Express Green Card", issuer: "American Express", id: "amex_green", image: "images/amex_green.png" },
    { name: "American Express Blue Cash Preferred", issuer: "American Express", id: "amex_blue_cash_preferred", image: "images/amex_blue_cash_preferred.png" },
    { name: "American Express Blue Cash Everyday", issuer: "American Express", id: "amex_blue_cash_everyday", image: "images/amex_blue_cash_everyday.png" },
    { name: "American Express Blue Business Plus", issuer: "American Express", id: "amex_blue_business_plus", image: "images/amex_blue_business_plus.png" },
    { name: "American Express Blue Business Cash", issuer: "American Express", id: "amex_blue_business_cash", image: "images/amex_blue_business_cash.png" },
    { name: "American Express Business Platinum", issuer: "American Express", id: "amex_biz_platinum", image: "images/amex_biz_platinum.png" },
    { name: "American Express Business Gold", issuer: "American Express", id: "amex_biz_gold", image: "images/amex_biz_gold.png" },
    { name: "American Express Business Green", issuer: "American Express", id: "amex_biz_green", image: "images/amex_biz_green.png" },
    { name: "American Express Hilton Honors", issuer: "American Express", id: "amex_hilton", image: "images/amex_hilton.png" },
    { name: "American Express Hilton Honors Surpass", issuer: "American Express", id: "amex_hilton_surpass", image: "images/amex_hilton_surpass.png" },
    { name: "American Express Hilton Honors Aspire", issuer: "American Express", id: "amex_hilton_aspire", image: "images/amex_hilton_aspire.png" },
    { name: "American Express Hilton Honors Business", issuer: "American Express", id: "amex_hilton_business", image: "images/amex_hilton_business.png" },
    { name: "American Express Delta SkyMiles Blue", issuer: "American Express", id: "amex_delta_blue", image: "images/amex_delta_blue.png" },
    { name: "American Express Delta SkyMiles Gold", issuer: "American Express", id: "amex_delta_gold", image: "images/amex_delta_gold.png" },
    { name: "American Express Delta SkyMiles Platinum", issuer: "American Express", id: "amex_delta_platinum", image: "images/amex_delta_platinum.png" },
    { name: "American Express Delta SkyMiles Reserve", issuer: "American Express", id: "amex_delta_reserve", image: "images/amex_delta_reserve.png" },
    { name: "American Express Delta SkyMiles Reserve Business", issuer: "American Express", id: "amex_delta_reserve_business", image: "images/amex_delta_reserve_business.png" },
    { name: "American Express Marriott Bonvoy Brilliant", issuer: "American Express", id: "amex_marriott", image: "images/amex_marriott.png" },
    { name: "American Express Marriott Bonvoy Bevy", issuer: "American Express", id: "amex_marriott_bevy", image: "images/amex_marriott_bevy.png" },
    { name: "American Express Marriott Bonvoy Business", issuer: "American Express", id: "amex_marriott_business", image: "images/amex_marriott_business.png" },
    { name: "American Express Cash Magnet", issuer: "American Express", id: "amex_cash_magnet", image: "images/amex_cash_magnet.png" },
    { name: "American Express EveryDay", issuer: "American Express", id: "amex_everyday", image: "images/amex_everyday.png" },
    { name: "American Express EveryDay Preferred", issuer: "American Express", id: "amex_everyday_preferred", image: "images/amex_everyday_preferred.png" },
    { name: "American Express Centurion (Black Card)", issuer: "American Express", id: "amex_centurion", image: "images/amex_centurion.png" },
    { name: "American Express Lowe's Business Rewards", issuer: "American Express", id: "amex_lowes_business", image: "images/amex_lowes_business.png" },
    { name: "American Express Amazon Business Card", issuer: "American Express", id: "amex_amazon_business", image: "images/amex_amazon_business.png" },
    { name: "American Express Amazon Business Prime Card", issuer: "American Express", id: "amex_amazon_business_prime", image: "images/amex_amazon_business_prime.png" },
    
    // Capital One Cards
    { name: "Capital One Venture Rewards", issuer: "Capital One", id: "capital_one_venture", image: "images/capital_one_venture.png" },
    { name: "Capital One Venture X Rewards", issuer: "Capital One", id: "capital_one_venture_x", image: "images/capital_one_venture_x.png" },
    { name: "Capital One VentureOne Rewards", issuer: "Capital One", id: "capital_one_venture_one", image: "images/capital_one_venture_one.png" },
    { name: "Capital One Savor Cash Rewards", issuer: "Capital One", id: "capital_one_savor", image: "images/capital_one_savor.png" },
    { name: "Capital One SavorOne Cash Rewards", issuer: "Capital One", id: "capital_one_savor_one", image: "images/capital_one_savor_one.png" },
    { name: "Capital One Quicksilver Cash Rewards", issuer: "Capital One", id: "capital_one_quicksilver", image: "images/capital_one_quicksilver.png" },
    { name: "Capital One QuicksilverOne Cash Rewards", issuer: "Capital One", id: "capital_one_quicksilver_one", image: "images/capital_one_quicksilver_one.png" },
    { name: "Capital One Walmart Rewards", issuer: "Capital One", id: "capital_one_walmart", image: "images/capital_one_walmart.png" },
    { name: "Capital One Platinum Mastercard", issuer: "Capital One", id: "capital_one_platinum", image: "images/capital_one_platinum.png" },
    { name: "Capital One Secured Mastercard", issuer: "Capital One", id: "capital_one_secured", image: "images/capital_one_secured.png" },
    { name: "Capital One Spark Cash Plus", issuer: "Capital One", id: "capital_one_spark", image: "images/capital_one_spark.png" },
    { name: "Capital One Spark Cash Select", issuer: "Capital One", id: "capital_one_spark_select", image: "images/capital_one_spark_select.png" },
    { name: "Capital One Spark Miles", issuer: "Capital One", id: "capital_one_spark_miles", image: "images/capital_one_spark_miles.png" },
    { name: "Capital One Spark Miles Select", issuer: "Capital One", id: "capital_one_spark_miles_select", image: "images/capital_one_spark_miles_select.png" },
    { name: "Capital One Spark Classic", issuer: "Capital One", id: "capital_one_spark_classic", image: "images/capital_one_spark_classic.png" },
    
    // Citi Cards
    { name: "Citi Double Cash Card", issuer: "Citi", id: "citi_double_cash", image: "images/citi_double_cash.png" },
    { name: "Citi Premier Card", issuer: "Citi", id: "citi_premier", image: "images/citi_premier.png" },
    { name: "Citi Prestige Card", issuer: "Citi", id: "citi_prestige", image: "images/citi_prestige.png" },
    { name: "Citi Custom Cash Card", issuer: "Citi", id: "citi_custom_cash", image: "images/citi_custom_cash.png" },
    { name: "Citi AAdvantage Platinum Select", issuer: "Citi", id: "citi_aadvantage", image: "images/citi_aadvantage.png" },
    { name: "Citi AAdvantage Executive", issuer: "Citi", id: "citi_aadvantage_executive", image: "images/citi_aadvantage_executive.png" },
    { name: "Citi AAdvantage Business", issuer: "Citi", id: "citi_aadvantage_business", image: "images/citi_aadvantage_business.png" },
    { name: "Citi Rewards+ Card", issuer: "Citi", id: "citi_rewards_plus", image: "images/citi_rewards_plus.png" },
    { name: "Citi Diamond Preferred", issuer: "Citi", id: "citi_diamond_preferred", image: "images/citi_diamond_preferred.png" },
    { name: "Citi Simplicity Card", issuer: "Citi", id: "citi_simplicity", image: "images/citi_simplicity.png" },
    { name: "Citi Secured Mastercard", issuer: "Citi", id: "citi_secured", image: "images/citi_secured.png" },
    { name: "Costco Anywhere Visa", issuer: "Citi", id: "costco_anywhere", image: "images/costco_anywhere.png" },
    { name: "Best Buy Credit Card", issuer: "Citi", id: "best_buy_card", image: "images/best_buy_card.png" },
    { name: "AT&T Points Plus Card", issuer: "Citi", id: "att_points_plus", image: "images/att_points_plus.png" },
    
    // Discover Cards
    { name: "Discover it Cash Back", issuer: "Discover", id: "discover_it_cash", image: "images/discover_it_cash.png" },
    { name: "Discover it Miles", issuer: "Discover", id: "discover_it_miles", image: "images/discover_it_miles.png" },
    { name: "Discover it Chrome", issuer: "Discover", id: "discover_it_chrome", image: "images/discover_it_chrome.png" },
    { name: "Discover it Student Cash Back", issuer: "Discover", id: "discover_it_student_cash", image: "images/discover_it_student_cash.png" },
    { name: "Discover it Student Chrome", issuer: "Discover", id: "discover_it_student_chrome", image: "images/discover_it_student_chrome.png" },
    { name: "Discover it Secured", issuer: "Discover", id: "discover_it_secured", image: "images/discover_it_secured.png" },
    { name: "Discover it Business", issuer: "Discover", id: "discover_it_business", image: "images/discover_it_business.png" },
    { name: "Discover it Balance Transfer", issuer: "Discover", id: "discover_it_balance_transfer", image: "images/discover_it_balance_transfer.png" },
    { name: "NHL Discover it Card", issuer: "Discover", id: "nhl_discover_it", image: "images/nhl_discover_it.png" },
    
    // Wells Fargo Cards
    { name: "Wells Fargo Active Cash Card", issuer: "Wells Fargo", id: "wells_fargo_active_cash", image: "images/wells_fargo_active_cash.png" },
    { name: "Wells Fargo Autograph Card", issuer: "Wells Fargo", id: "wells_fargo_autograph", image: "images/wells_fargo_autograph.png" },
    { name: "Wells Fargo Autograph Journey Card", issuer: "Wells Fargo", id: "wells_fargo_autograph_journey", image: "images/wells_fargo_autograph_journey.png" },
    { name: "Wells Fargo Reflect Card", issuer: "Wells Fargo", id: "wells_fargo_reflect", image: "images/wells_fargo_reflect.png" },
    { name: "Wells Fargo Signify Business Cash", issuer: "Wells Fargo", id: "wells_fargo_signify", image: "images/wells_fargo_signify.png" },
    { name: "Wells Fargo Business Platinum", issuer: "Wells Fargo", id: "wells_fargo_business_platinum", image: "images/wells_fargo_business_platinum.png" },
    { name: "Bilt Mastercard", issuer: "Wells Fargo", id: "bilt_mastercard", image: "images/bilt_mastercard.png" },
    { name: "Wells Fargo Secured Card", issuer: "Wells Fargo", id: "wells_fargo_secured", image: "images/wells_fargo_secured.png" },
    { name: "Wells Fargo Attune Card", issuer: "Wells Fargo", id: "wells_fargo_attune", image: "images/wells_fargo_attune.png" },
    
    // Bank of America Cards
    { name: "Bank of America Premium Rewards", issuer: "Bank of America", id: "boa_premium_rewards", image: "images/boa_premium_rewards.png" },
    { name: "Bank of America Premium Rewards Elite", issuer: "Bank of America", id: "boa_premium_rewards_elite", image: "images/boa_premium_rewards_elite.png" },
    { name: "Bank of America Cash Rewards", issuer: "Bank of America", id: "boa_cash_rewards", image: "images/boa_cash_rewards.png" },
    { name: "Bank of America Customized Cash Rewards", issuer: "Bank of America", id: "boa_customized_cash", image: "images/boa_customized_cash.png" },
    { name: "Bank of America Travel Rewards", issuer: "Bank of America", id: "boa_travel_rewards", image: "images/boa_travel_rewards.png" },
    { name: "Bank of America Unlimited Cash Rewards", issuer: "Bank of America", id: "boa_unlimited_cash", image: "images/boa_unlimited_cash.png" },
    { name: "Bank of America Business Advantage Cash Rewards", issuer: "Bank of America", id: "boa_business_advantage_cash", image: "images/boa_business_advantage_cash.png" },
    { name: "Bank of America Business Advantage Travel Rewards", issuer: "Bank of America", id: "boa_business_advantage_travel", image: "images/boa_business_advantage_travel.png" },
    { name: "Bank of America Business Advantage Unlimited Cash", issuer: "Bank of America", id: "boa_business_advantage_unlimited", image: "images/boa_business_advantage_unlimited.png" },
    { name: "Bank of America Secured Card", issuer: "Bank of America", id: "boa_secured", image: "images/boa_secured.png" },
    { name: "Alaska Airlines Visa", issuer: "Bank of America", id: "alaska_airlines_visa", image: "images/alaska_airlines_visa.png" },
    { name: "Alaska Airlines Visa Business", issuer: "Bank of America", id: "alaska_airlines_visa_business", image: "images/alaska_airlines_visa_business.png" },
    
    // Barclays Cards
    { name: "Barclays AAdvantage Aviator Red", issuer: "Barclays", id: "barclays_aviator_red", image: "images/barclays_aviator_red.png" },
    { name: "Barclays AAdvantage Aviator Silver", issuer: "Barclays", id: "barclays_aviator_silver", image: "images/barclays_aviator_silver.png" },
    { name: "Barclays AAdvantage Aviator Business", issuer: "Barclays", id: "barclays_aviator_business", image: "images/barclays_aviator_business.png" },
    { name: "JetBlue Card", issuer: "Barclays", id: "jetblue_card", image: "images/jetblue_card.png" },
    { name: "JetBlue Plus Card", issuer: "Barclays", id: "jetblue_plus_card", image: "images/jetblue_plus_card.png" },
    { name: "JetBlue Business Card", issuer: "Barclays", id: "jetblue_business_card", image: "images/jetblue_business_card.png" },
    { name: "Hawaiian Airlines World Elite Mastercard", issuer: "Barclays", id: "hawaiian_airlines_card", image: "images/hawaiian_airlines_card.png" },
    { name: "Hawaiian Airlines Business Mastercard", issuer: "Barclays", id: "hawaiian_airlines_business", image: "images/hawaiian_airlines_business.png" },
    { name: "Wyndham Rewards Earner Card", issuer: "Barclays", id: "wyndham_rewards_earner", image: "images/wyndham_rewards_earner.png" },
    { name: "Wyndham Rewards Earner Plus", issuer: "Barclays", id: "wyndham_rewards_earner_plus", image: "images/wyndham_rewards_earner_plus.png" },
    { name: "Wyndham Rewards Earner Business", issuer: "Barclays", id: "wyndham_rewards_business", image: "images/wyndham_rewards_business.png" },
    { name: "Uber Visa Card", issuer: "Barclays", id: "uber_visa", image: "images/uber_visa.png" },
    { name: "Barnes & Noble Mastercard", issuer: "Barclays", id: "barnes_noble_mastercard", image: "images/barnes_noble_mastercard.png" },
    { name: "Frontier Airlines Mastercard", issuer: "Barclays", id: "frontier_airlines", image: "images/frontier_airlines.png" },
    { name: "Spirit Airlines World Mastercard", issuer: "Barclays", id: "spirit_airlines", image: "images/spirit_airlines.png" },
    
    // U.S. Bank Cards
    { name: "U.S. Bank Altitude Reserve", issuer: "U.S. Bank", id: "us_bank_altitude_reserve", image: "images/us_bank_altitude_reserve.png" },
    { name: "U.S. Bank Altitude Connect", issuer: "U.S. Bank", id: "us_bank_altitude_connect", image: "images/us_bank_altitude_connect.png" },
    { name: "U.S. Bank Altitude Go", issuer: "U.S. Bank", id: "us_bank_altitude_go", image: "images/us_bank_altitude_go.png" },
    { name: "U.S. Bank Cash+", issuer: "U.S. Bank", id: "us_bank_cash_plus", image: "images/us_bank_cash_plus.png" },
    { name: "U.S. Bank Shopper Cash Rewards", issuer: "U.S. Bank", id: "us_bank_shopper_cash", image: "images/us_bank_shopper_cash.png" },
    { name: "U.S. Bank Visa Platinum", issuer: "U.S. Bank", id: "us_bank_visa_platinum", image: "images/us_bank_visa_platinum.png" },
    { name: "U.S. Bank Business Cash Rewards", issuer: "U.S. Bank", id: "us_bank_business_cash", image: "images/us_bank_business_cash.png" },
    { name: "U.S. Bank Business Triple Cash", issuer: "U.S. Bank", id: "us_bank_business_triple_cash", image: "images/us_bank_business_triple_cash.png" },
    { name: "U.S. Bank Business Leverage", issuer: "U.S. Bank", id: "us_bank_business_leverage", image: "images/us_bank_business_leverage.png" },
    { name: "U.S. Bank Secured Visa", issuer: "U.S. Bank", id: "us_bank_secured", image: "images/us_bank_secured.png" },
    { name: "REI Co-op Mastercard", issuer: "U.S. Bank", id: "rei_coop", image: "images/rei_coop.png" },
    { name: "Kroger Rewards World Mastercard", issuer: "U.S. Bank", id: "kroger_rewards", image: "images/kroger_rewards.png" },
    
    // PNC Cards
    { name: "PNC Cash Rewards", issuer: "PNC", id: "pnc_cash_rewards", image: "images/pnc_cash_rewards.png" },
    { name: "PNC Points", issuer: "PNC", id: "pnc_points", image: "images/pnc_points.png" },
    { name: "PNC Core", issuer: "PNC", id: "pnc_core", image: "images/pnc_core.png" },
    { name: "PNC Secured", issuer: "PNC", id: "pnc_secured", image: "images/pnc_secured.png" },
    
    // TD Bank Cards
    { name: "TD Cash Card", issuer: "TD Bank", id: "td_cash", image: "images/td_cash.png" },
    { name: "TD Double Up Card", issuer: "TD Bank", id: "td_double_up", image: "images/td_double_up.png" },
    { name: "TD FlexPay Card", issuer: "TD Bank", id: "td_flexpay", image: "images/td_flexpay.png" },
    { name: "TD Clear Card", issuer: "TD Bank", id: "td_clear", image: "images/td_clear.png" },
    { name: "TD Business Solutions Card", issuer: "TD Bank", id: "td_business_solutions", image: "images/td_business_solutions.png" },
    { name: "Target RedCard", issuer: "TD Bank", id: "target_redcard", image: "images/target_redcard.png" },
    
    // Synchrony Cards
    { name: "PayPal Cashback Mastercard", issuer: "Synchrony", id: "paypal_cashback", image: "images/paypal_cashback.png" },
    { name: "PayPal 2% Cashback Mastercard", issuer: "Synchrony", id: "paypal_2_percent", image: "images/paypal_2_percent.png" },
    { name: "Venmo Credit Card", issuer: "Synchrony", id: "venmo_credit_card", image: "images/venmo_credit_card.png" },
    { name: "Amazon Store Card", issuer: "Synchrony", id: "amazon_store_card", image: "images/amazon_store_card.png" },
    { name: "Amazon Secured Card", issuer: "Synchrony", id: "amazon_secured", image: "images/amazon_secured.png" },
    { name: "Sam's Club Mastercard", issuer: "Synchrony", id: "sams_club_mastercard", image: "images/sams_club_mastercard.png" },
    { name: "Lowe's Advantage Card", issuer: "Synchrony", id: "lowes_advantage", image: "images/lowes_advantage.png" },
    { name: "Lowe's Business Advantage", issuer: "Synchrony", id: "lowes_business_advantage", image: "images/lowes_business_advantage.png" },
    { name: "Gap Visa", issuer: "Synchrony", id: "gap_visa", image: "images/gap_visa.png" },
    { name: "Old Navy Card", issuer: "Synchrony", id: "old_navy_card", image: "images/old_navy_card.png" },
    { name: "Banana Republic Card", issuer: "Synchrony", id: "banana_republic_card", image: "images/banana_republic_card.png" },
    { name: "TJX Rewards Credit Card", issuer: "Synchrony", id: "tjx_rewards", image: "images/tjx_rewards.png" },
    { name: "Verizon Visa Card", issuer: "Synchrony", id: "verizon_visa", image: "images/verizon_visa.png" },
    { name: "CareCredit", issuer: "Synchrony", id: "carecredit", image: "images/carecredit.png" },
    { name: "Pet Valu Rewards Mastercard", issuer: "Synchrony", id: "pet_valu", image: "images/pet_valu.png" },
    
    // Store & Retail Cards
    { name: "Apple Card", issuer: "Goldman Sachs", id: "apple_card", image: "images/apple_card.png" },
    { name: "Amazon Prime Rewards Visa", issuer: "Chase", id: "amazon_prime_visa", image: "images/amazon_prime_visa.png" },
    { name: "Macy's Credit Card", issuer: "Department Stores National Bank", id: "macys_credit_card", image: "images/macys_credit_card.png" },
    { name: "Macy's American Express", issuer: "Department Stores National Bank", id: "macys_amex", image: "images/macys_amex.png" },
    { name: "Nordstrom Credit Card", issuer: "TD Bank", id: "nordstrom_card", image: "images/nordstrom_card.png" },
    { name: "Nordstrom Visa", issuer: "TD Bank", id: "nordstrom_visa", image: "images/nordstrom_visa.png" },
    { name: "Bloomingdale's Credit Card", issuer: "Department Stores National Bank", id: "bloomingdales_card", image: "images/bloomingdales_card.png" },
    { name: "Bloomingdale's American Express", issuer: "Department Stores National Bank", id: "bloomingdales_amex", image: "images/bloomingdales_amex.png" },
    { name: "Kohl's Credit Card", issuer: "Capital One", id: "kohls_card", image: "images/kohls_card.png" },
    { name: "JCPenney Credit Card", issuer: "Synchrony", id: "jcpenney_card", image: "images/jcpenney_card.png" },
    { name: "Sears Card", issuer: "Citi", id: "sears_card", image: "images/sears_card.png" },
    { name: "Home Depot Consumer Credit Card", issuer: "Citi", id: "home_depot_card", image: "images/home_depot_card.png" },
    { name: "Home Depot Commercial Card", issuer: "Citi", id: "home_depot_commercial", image: "images/home_depot_commercial.png" },
    { name: "Walmart Rewards Card", issuer: "Capital One", id: "walmart_rewards_card", image: "images/walmart_rewards_card.png" },
    { name: "Walmart Rewards Mastercard", issuer: "Capital One", id: "walmart_rewards_mastercard", image: "images/walmart_rewards_mastercard.png" },
    { name: "Dick's Sporting Goods Card", issuer: "Synchrony", id: "dicks_sporting_goods", image: "images/dicks_sporting_goods.png" },
    { name: "Nike Credit Card", issuer: "Synchrony", id: "nike_credit_card", image: "images/nike_credit_card.png" },
    { name: "Cabela's Credit Card", issuer: "Capital One", id: "cabelas_card", image: "images/cabelas_card.png" },
    { name: "Bass Pro Shops Credit Card", issuer: "Capital One", id: "bass_pro_shops", image: "images/bass_pro_shops.png" },
    { name: "BJ's One Mastercard", issuer: "Comenity Bank", id: "bjs_one_mastercard", image: "images/bjs_one_mastercard.png" },
    { name: "Wayfair Credit Card", issuer: "Citi", id: "wayfair_card", image: "images/wayfair_card.png" },
    { name: "Overstock Store Credit Card", issuer: "TD Bank", id: "overstock_card", image: "images/overstock_card.png" },
    { name: "Williams Sonoma Visa", issuer: "Comenity Bank", id: "williams_sonoma_visa", image: "images/williams_sonoma_visa.png" },
    { name: "Pottery Barn Credit Card", issuer: "Comenity Bank", id: "pottery_barn_card", image: "images/pottery_barn_card.png" },
    { name: "West Elm Credit Card", issuer: "Comenity Bank", id: "west_elm_card", image: "images/west_elm_card.png" },
    { name: "Crate & Barrel Credit Card", issuer: "Comenity Bank", id: "crate_barrel_card", image: "images/crate_barrel_card.png" },
    { name: "CB2 Credit Card", issuer: "Comenity Bank", id: "cb2_card", image: "images/cb2_card.png" },
    { name: "Bed Bath & Beyond Mastercard", issuer: "Comenity Bank", id: "bed_bath_beyond", image: "images/bed_bath_beyond.png" },
    { name: "Buy Buy Baby Mastercard", issuer: "Comenity Bank", id: "buy_buy_baby", image: "images/buy_buy_baby.png" },
    
    // Gas Station Cards
    { name: "Shell Gas Card", issuer: "Citi", id: "shell_gas_card", image: "images/shell_gas_card.png" },
    { name: "Chevron Texaco Card", issuer: "Synchrony", id: "chevron_texaco", image: "images/chevron_texaco.png" },
    { name: "BP Credit Card", issuer: "Synchrony", id: "bp_credit_card", image: "images/bp_credit_card.png" },
    { name: "Exxon Mobil Credit Card", issuer: "Citi", id: "exxon_mobil", image: "images/exxon_mobil.png" },
    { name: "Sunoco Credit Card", issuer: "Citi", id: "sunoco_card", image: "images/sunoco_card.png" },
    { name: "Phillips 66 Credit Card", issuer: "Synchrony", id: "phillips_66", image: "images/phillips_66.png" },
    { name: "Conoco Credit Card", issuer: "Synchrony", id: "conoco_card", image: "images/conoco_card.png" },
    { name: "76 Credit Card", issuer: "Synchrony", id: "76_card", image: "images/76_card.png" },
    { name: "Marathon Credit Card", issuer: "Synchrony", id: "marathon_card", image: "images/marathon_card.png" },
    { name: "ARCO Credit Card", issuer: "Synchrony", id: "arco_card", image: "images/arco_card.png" },
    { name: "Speedway Credit Card", issuer: "First Bankcard", id: "speedway_card", image: "images/speedway_card.png" },
    { name: "Wawa Credit Card", issuer: "Synchrony", id: "wawa_card", image: "images/wawa_card.png" },
    
    // Other Regional & Specialty Banks
    { name: "HSBC Elite Mastercard", issuer: "HSBC", id: "hsbc_elite", image: "images/hsbc_elite.png" },
    { name: "HSBC Cash Rewards Mastercard", issuer: "HSBC", id: "hsbc_cash_rewards", image: "images/hsbc_cash_rewards.png" },
    { name: "HSBC Premier World Mastercard", issuer: "HSBC", id: "hsbc_premier_world", image: "images/hsbc_premier_world.png" },
    { name: "Santander Ultimate Cash Back", issuer: "Santander", id: "santander_ultimate", image: "images/santander_ultimate.png" },
    { name: "Santander Sphere Elite", issuer: "Santander", id: "santander_sphere", image: "images/santander_sphere.png" },
    { name: "KeyBank Latitude Card", issuer: "KeyBank", id: "keybank_latitude", image: "images/keybank_latitude.png" },
    { name: "KeyBank Rewards Card", issuer: "KeyBank", id: "keybank_rewards", image: "images/keybank_rewards.png" },
    { name: "Regions Prestige Visa", issuer: "Regions Bank", id: "regions_prestige", image: "images/regions_prestige.png" },
    { name: "Regions Cash Back Visa", issuer: "Regions Bank", id: "regions_cash_back", image: "images/regions_cash_back.png" },
    { name: "Regions Secured Card", issuer: "Regions Bank", id: "regions_secured", image: "images/regions_secured.png" },
    { name: "Fifth Third Cash/Back Card", issuer: "Fifth Third Bank", id: "fifth_third_cash_back", image: "images/fifth_third_cash_back.png" },
    { name: "Fifth Third Truly Simple Card", issuer: "Fifth Third Bank", id: "fifth_third_truly_simple", image: "images/fifth_third_truly_simple.png" },
    { name: "Citizens Cash Back Plus", issuer: "Citizens Bank", id: "citizens_cash_back_plus", image: "images/citizens_cash_back_plus.png" },
    { name: "Citizens Clear Value", issuer: "Citizens Bank", id: "citizens_clear_value", image: "images/citizens_clear_value.png" },
    { name: "M&T Bank Visa Credit Card", issuer: "M&T Bank", id: "mt_bank_visa", image: "images/mt_bank_visa.png" },
    { name: "M&T Visa Signature", issuer: "M&T Bank", id: "mt_bank_signature", image: "images/mt_bank_signature.png" },
    { name: "BB&T Spectrum Cash Rewards", issuer: "Truist", id: "bbt_spectrum", image: "images/bbt_spectrum.png" },
    { name: "BB&T Bright Card", issuer: "Truist", id: "bbt_bright", image: "images/bbt_bright.png" },
    { name: "SunTrust Cash Rewards", issuer: "Truist", id: "suntrust_cash_rewards", image: "images/suntrust_cash_rewards.png" },
    { name: "SunTrust Travel Rewards", issuer: "Truist", id: "suntrust_travel", image: "images/suntrust_travel.png" },
    { name: "Truist Enjoy Cash", issuer: "Truist", id: "truist_enjoy_cash", image: "images/truist_enjoy_cash.png" },
    { name: "Truist Enjoy Travel", issuer: "Truist", id: "truist_enjoy_travel", image: "images/truist_enjoy_travel.png" },
    { name: "Truist Enjoy Beyond", issuer: "Truist", id: "truist_enjoy_beyond", image: "images/truist_enjoy_beyond.png" },
    { name: "Comerica Visa Platinum", issuer: "Comerica Bank", id: "comerica_visa", image: "images/comerica_visa.png" },
    { name: "Comerica Secured Card", issuer: "Comerica Bank", id: "comerica_secured", image: "images/comerica_secured.png" },
    
    // Credit Union Cards
    { name: "Navy Federal Credit Union cashRewards", issuer: "Navy Federal", id: "navy_federal_cash_rewards", image: "images/navy_federal_cash_rewards.png" },
    { name: "Navy Federal Credit Union More Rewards", issuer: "Navy Federal", id: "navy_federal_more_rewards", image: "images/navy_federal_more_rewards.png" },
    { name: "Navy Federal Credit Union GO REWARDS", issuer: "Navy Federal", id: "navy_federal_go_rewards", image: "images/navy_federal_go_rewards.png" },
    { name: "Navy Federal Credit Union Flagship Rewards", issuer: "Navy Federal", id: "navy_federal_flagship", image: "images/navy_federal_flagship.png" },
    { name: "Pentagon Federal Promise Card", issuer: "PenFed", id: "penfed_promise", image: "images/penfed_promise.png" },
    { name: "Pentagon Federal Power Cash", issuer: "PenFed", id: "penfed_power_cash", image: "images/penfed_power_cash.png" },
    { name: "Pentagon Federal Gold", issuer: "PenFed", id: "penfed_gold", image: "images/penfed_gold.png" },
    { name: "Pentagon Federal Platinum", issuer: "PenFed", id: "penfed_platinum", image: "images/penfed_platinum.png" },
    { name: "Pentagon Federal Pathfinder", issuer: "PenFed", id: "penfed_pathfinder", image: "images/penfed_pathfinder.png" },
    { name: "USAA Rewards Visa", issuer: "USAA", id: "usaa_rewards", image: "images/usaa_rewards.png" },
    { name: "USAA Cashback Rewards Plus", issuer: "USAA", id: "usaa_cashback_plus", image: "images/usaa_cashback_plus.png" },
    { name: "USAA Preferred Cash Rewards", issuer: "USAA", id: "usaa_preferred_cash", image: "images/usaa_preferred_cash.png" },
    { name: "USAA Rate Advantage", issuer: "USAA", id: "usaa_rate_advantage", image: "images/usaa_rate_advantage.png" },
    { name: "State Employees' Credit Union Visa", issuer: "SECU", id: "secu_visa", image: "images/secu_visa.png" },
    { name: "State Employees' Credit Union CashBack", issuer: "SECU", id: "secu_cashback", image: "images/secu_cashback.png" },
    { name: "SchoolsFirst FCU Inspire Card", issuer: "SchoolsFirst FCU", id: "schoolsfirst_inspire", image: "images/schoolsfirst_inspire.png" },
    { name: "SchoolsFirst FCU Cash Back", issuer: "SchoolsFirst FCU", id: "schoolsfirst_cashback", image: "images/schoolsfirst_cashback.png" },
    { name: "Golden 1 Credit Union Platinum Rewards", issuer: "Golden 1", id: "golden1_platinum", image: "images/golden1_platinum.png" },
    { name: "Golden 1 Credit Union Cash Back", issuer: "Golden 1", id: "golden1_cashback", image: "images/golden1_cashback.png" },
    { name: "Alliant Cashback Visa Signature", issuer: "Alliant", id: "alliant_cashback", image: "images/alliant_cashback.png" },
    { name: "Alliant Platinum Rewards", issuer: "Alliant", id: "alliant_platinum", image: "images/alliant_platinum.png" },
    { name: "DCU Visa Platinum", issuer: "DCU", id: "dcu_visa_platinum", image: "images/dcu_visa_platinum.png" },
    { name: "Affinity Cash Rewards", issuer: "Affinity FCU", id: "affinity_cash_rewards", image: "images/affinity_cash_rewards.png" },
    { name: "Affinity Pure Rewards", issuer: "Affinity FCU", id: "affinity_pure_rewards", image: "images/affinity_pure_rewards.png" },
    
    // Luxury/Premium Cards
    { name: "JP Morgan Reserve Card", issuer: "JP Morgan Chase", id: "jp_morgan_reserve", image: "images/jp_morgan_reserve.png" },
    { name: "Citi Chairman Card", issuer: "Citi", id: "citi_chairman", image: "images/citi_chairman.png" },
    { name: "Dubai First Royale Mastercard", issuer: "Dubai First", id: "dubai_first_royale", image: "images/dubai_first_royale.png" },
    { name: "Stratus White Card", issuer: "Stratus Rewards", id: "stratus_white", image: "images/stratus_white.png" },
    
    // Crypto/Digital Cards
    { name: "Crypto.com Visa Card", issuer: "Crypto.com", id: "crypto_com_visa", image: "images/crypto_com_visa.png" },
    { name: "Coinbase Card", issuer: "Coinbase", id: "coinbase_card", image: "images/coinbase_card.png" },
    { name: "BlockFi Bitcoin Rewards Card", issuer: "BlockFi", id: "blockfi_bitcoin", image: "images/blockfi_bitcoin.png" },
    { name: "Gemini Credit Card", issuer: "Gemini", id: "gemini_card", image: "images/gemini_card.png" },
    { name: "Binance Card", issuer: "Binance", id: "binance_card", image: "images/binance_card.png" },
    { name: "SoFi Credit Card", issuer: "SoFi", id: "sofi_credit_card", image: "images/sofi_credit_card.png" },
    { name: "Upgrade Card", issuer: "Upgrade", id: "upgrade_card", image: "images/upgrade_card.png" },
    { name: "Upgrade Triple Cash", issuer: "Upgrade", id: "upgrade_triple_cash", image: "images/upgrade_triple_cash.png" },
    { name: "Petal 1 Card", issuer: "Petal", id: "petal_1", image: "images/petal_1.png" },
    { name: "Petal 2 Card", issuer: "Petal", id: "petal_2", image: "images/petal_2.png" },
    { name: "Jasper Cash Back Mastercard", issuer: "Jasper", id: "jasper_cashback", image: "images/jasper_cashback.png" },
    { name: "Tomo Credit Card", issuer: "TomoCredit", id: "tomo_credit", image: "images/tomo_credit.png" },
    { name: "X1 Card", issuer: "X1", id: "x1_card", image: "images/x1_card.png" },
    { name: "Brex Corporate Card", issuer: "Brex", id: "brex_corporate", image: "images/brex_corporate.png" },
    { name: "Ramp Corporate Card", issuer: "Ramp", id: "ramp_corporate", image: "images/ramp_corporate.png" },
    { name: "Divvy Corporate Card", issuer: "Divvy", id: "divvy_corporate", image: "images/divvy_corporate.png" }
];

let filteredCards = [...CREDIT_CARDS_DATABASE];

document.addEventListener('DOMContentLoaded', function() {
    // First, inject content script into the active tab
    chrome.runtime.sendMessage({ action: 'injectContentScript' }, (response) => {
        if (response && response.success) {
            console.log('Content script injected successfully');
        } else {
            console.error('Failed to inject content script:', response?.error);
        }
    });
    
    // Initialize settings functionality
    setupSettings();
    
    // Initialize the extension
    loadCurrentSite();
    loadSelectedCards();
    setupCardSearch();
    loadApiKeyStatus();
    setupApiKeyEditing();
    
    // Set up analyze button
    document.getElementById('analyzeBtn').addEventListener('click', analyzeCurrentMerchant);
});

// Settings functionality
function setupSettings() {
    const settingsToggle = document.getElementById('settingsToggle');
    const closeSettings = document.getElementById('closeSettings');
    const settingsPanel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    const mainContent = document.getElementById('mainContent');
    
    function openSettings() {
        settingsPanel.classList.add('open');
        overlay.classList.add('active');
        mainContent.classList.add('settings-open');
        settingsToggle.classList.add('active');
    }
    
    function closeSettingsPanel() {
        settingsPanel.classList.remove('open');
        overlay.classList.remove('active');
        mainContent.classList.remove('settings-open');
        settingsToggle.classList.remove('active');
    }
    
    settingsToggle.addEventListener('click', () => {
        if (settingsPanel.classList.contains('open')) {
            closeSettingsPanel();
        } else {
            openSettings();
        }
    });
    
    closeSettings.addEventListener('click', closeSettingsPanel);
    overlay.addEventListener('click', closeSettingsPanel);
}

// Get and display the current website
async function loadCurrentSite() {
    try {
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const url = new URL(tab.url);
        const domain = url.hostname.replace('www.', '');
        document.getElementById('siteText').textContent = domain;
    } catch (error) {
        document.getElementById('siteText').textContent = 'Unknown site';
    }
}

// Set up the card search functionality
function setupCardSearch() {
    const searchInput = document.getElementById('cardSearch');
    const dropdown = document.getElementById('cardDropdown');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        // Get currently selected card IDs to exclude them from search
        chrome.storage.local.get('selectedCardIds').then(result => {
            const selectedIds = result.selectedCardIds || [];
            
            // Filter cards based on search, excluding already selected cards
            filteredCards = CREDIT_CARDS_DATABASE.filter(card => 
                !selectedIds.includes(card.id) && (
                    card.name.toLowerCase().includes(query) || 
                    card.issuer.toLowerCase().includes(query)
                )
            );
            
            displayCardDropdown();
            dropdown.style.display = 'block';
        });
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.card-search-input') && !e.target.closest('.card-dropdown')) {
            dropdown.style.display = 'none';
        }
    });
}

// Display filtered cards in dropdown
function displayCardDropdown() {
    const dropdown = document.getElementById('cardDropdown');
    
    if (filteredCards.length === 0) {
        dropdown.innerHTML = '<div style="padding: 12px; color: #8e8e93;">No cards found</div>';
        return;
    }
    
    dropdown.innerHTML = filteredCards.slice(0, 8).map(card => `
        <div class="card-option" data-card-id="${card.id}">
            <img src="${card.image}" alt="${card.name}" class="card-option-image" onerror="this.style.display='none'">
            <div class="card-option-info">
                <div class="card-option-name">${card.name}</div>
                <div class="card-option-issuer">${card.issuer}</div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers for card selection
    dropdown.querySelectorAll('.card-option').forEach(option => {
        option.addEventListener('click', () => {
            const cardId = option.getAttribute('data-card-id');
            addSelectedCard(cardId);
        });
    });
}

// Helper function to generate card display HTML
function generateCardDisplay(card, isLarge = false) {
    const sizeClass = isLarge ? 'selected-card-image' : 'card-option-image';
    const placeholderClass = isLarge ? 'selected-card-image-placeholder' : '';
    
    if (card.image) {
        return `<img src="${card.image}" alt="${card.name}" class="${sizeClass}" onerror="this.style.display='none'; this.nextElementSibling && (this.nextElementSibling.style.display='flex');" />
                <div class="${placeholderClass}" style="display:none;">💳</div>`;
    }
    return `<div class="${placeholderClass}">💳</div>`;
}

// Add a card to user's selected cards (store only IDs)
async function addSelectedCard(cardId) {
    const card = CREDIT_CARDS_DATABASE.find(c => c.id === cardId);
    if (!card) return;
    
    // Get existing selected card IDs
    const result = await chrome.storage.local.get('selectedCardIds');
    const selectedCardIds = result.selectedCardIds || [];
    
    // Check if card is already added
    if (selectedCardIds.includes(cardId)) {
        return;
    }
    
    // Add new card ID
    selectedCardIds.push(cardId);
    await chrome.storage.local.set({selectedCardIds: selectedCardIds});
    
    // Clear search and hide dropdown
    document.getElementById('cardSearch').value = '';
    document.getElementById('cardDropdown').style.display = 'none';
    
    // Refresh display
    loadSelectedCards();
}

// Load and display user's selected cards
async function loadSelectedCards() {
    const result = await chrome.storage.local.get('selectedCardIds');
    const selectedCardIds = result.selectedCardIds || [];
    const container = document.getElementById('selectedCardsList');
    const noCardsMsg = document.getElementById('noCardsMessage');
    
    if (selectedCardIds.length === 0) {
        container.style.display = 'none';
        noCardsMsg.classList.add('visible');
        return;
    }
    
    // Map IDs back to full card objects from the database
    const selectedCards = selectedCardIds
        .map(id => CREDIT_CARDS_DATABASE.find(card => card.id === id))
        .filter(card => card !== undefined);
    
    // If some cards weren't found, update the stored IDs
    if (selectedCards.length !== selectedCardIds.length) {
        const validIds = selectedCards.map(card => card.id);
        await chrome.storage.local.set({selectedCardIds: validIds});
    }
    
    noCardsMsg.classList.remove('visible');
    container.style.display = 'flex';
    container.innerHTML = selectedCards.map((card, index) => `
        <div class="selected-card">
            ${generateCardDisplay(card, true)}
            <div class="selected-card-info">
                <div class="selected-card-name">${card.name}</div>
                <div class="selected-card-issuer">${card.issuer}</div>
            </div>
            <button class="remove-card-button" data-card-id="${card.id}" title="Remove card">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `).join('');
    
    // Add event listeners to remove buttons
    container.querySelectorAll('.remove-card-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const cardId = e.currentTarget.getAttribute('data-card-id');
            removeSelectedCard(cardId);
        });
    });
}

// Remove a selected card
async function removeSelectedCard(cardId) {
    const result = await chrome.storage.local.get('selectedCardIds');
    const selectedCardIds = result.selectedCardIds || [];
    
    const index = selectedCardIds.indexOf(cardId);
    if (index > -1) {
        selectedCardIds.splice(index, 1);
        await chrome.storage.local.set({selectedCardIds: selectedCardIds});
        loadSelectedCards();
    }
}

// Use Claude AI to analyze the current merchant and recommend best card
async function analyzeCurrentMerchant() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultContainer = document.getElementById('recommendationResult');
    
    try {
        // Get current site and user's cards
        const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        const url = new URL(tab.url);
        const domain = url.hostname.replace('www.', '');
        
        const result = await chrome.storage.local.get('selectedCardIds');
        const selectedCardIds = result.selectedCardIds || [];
        
        if (selectedCardIds.length === 0) {
            resultContainer.innerHTML = `
                <div class="status-message warning">
                    <strong>No Cards Added</strong><br>
                    Add your credit cards in settings first
                </div>
            `;
            return;
        }
        
        // Map IDs to full card objects for the API call
        const selectedCards = selectedCardIds
            .map(id => CREDIT_CARDS_DATABASE.find(card => card.id === id))
            .filter(card => card !== undefined);
        
        // Check if API key is configured
        const keyResult = await chrome.storage.local.get('claudeApiKey');
        if (!keyResult.claudeApiKey) {
            resultContainer.innerHTML = `
                <div class="status-message warning">
                    <strong>API Key Required</strong><br>
                    Configure your Claude API key in settings
                </div>
            `;
            return;
        }
        
        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = `
            <div class="loading-spinner" style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span>Analyzing...</span>
        `;
        
        resultContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <div>Analyzing best rewards for ${domain}...</div>
            </div>
        `;
        
        // Send message to background script to handle API call
        const response = await chrome.runtime.sendMessage({
            action: 'analyzeCard',
            domain: domain,
            cards: selectedCards
        });
        
        if (!response || !response.success) {
            throw new Error(response?.error || 'API call failed');
        }
        
        const recommendation = response.data;
        
        // Display the recommendation
        displayDetailedComparison(recommendation, selectedCards, domain);
        
    } catch (error) {
        console.error('Analysis error:', error);
        resultContainer.innerHTML = `
            <div class="status-message error">
                <strong>Analysis Failed</strong><br>
                ${error.message || 'Please check your connection and try again'}
            </div>
        `;
    } finally {
        // Reset button
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>Analyze Best Card</span>
        `;
    }
}

// Display detailed comparison of all cards
function displayDetailedComparison(recommendation, selectedCards, domain) {
    const resultContainer = document.getElementById('recommendationResult');
    
    // Try to parse API response or fall back to mock data
    let cardComparisons;
    let optimalCard;
    
    try {
        // If recommendation is a structured response from Claude
        if (typeof recommendation === 'string') {
            // Try to extract JSON from Claude's response
            const jsonMatch = recommendation.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                cardComparisons = parsed.cardComparisons || parseCardComparisons(recommendation, selectedCards, domain);
                optimalCard = parsed.optimalCard || parseOptimalCard(recommendation, domain);
            } else {
                // Fall back to parsing text response
                cardComparisons = parseCardComparisons(recommendation, selectedCards, domain);
                optimalCard = parseOptimalCard(recommendation, domain);
            }
        } else {
            // Structured response
            cardComparisons = recommendation.cardComparisons || parseCardComparisons(recommendation, selectedCards, domain);
            optimalCard = recommendation.optimalCard || parseOptimalCard(recommendation, domain);
        }
    } catch (error) {
        console.error('Error parsing recommendation:', error);
        // Fall back to mock analysis
        cardComparisons = parseCardComparisons(recommendation, selectedCards, domain);
        optimalCard = parseOptimalCard(recommendation, domain);
    }
    
    // Sort cards by value (highest first)
    cardComparisons.sort((a, b) => b.value - a.value);
    
    const bestCard = cardComparisons[0];
    const merchantCat = getMerchantCategory(domain);
    
    let html = `
        <!-- Best Card Recommendation -->
        <div class="best-card-section">
            <div class="best-card-header">
                <span class="trophy-icon">🏆</span>
                <span class="best-card-title">Best Card for ${domain}</span>
            </div>
            <div class="best-card-display">
                ${bestCard ? `
                    <div class="winning-card">
                        <div class="winning-card-name">${bestCard.cardName}</div>
                        <div class="winning-card-reward">
                            <span class="reward-amount">${bestCard.displayValue}</span>
                            <span class="reward-type">${bestCard.rewardType}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <!-- Reasoning Section -->
        <div class="reasoning-section">
            <h4 class="reasoning-title">Why This Card Wins</h4>
            <div class="reasoning-content">
                ${bestCard ? `
                    <p>For ${domain} (${merchantCat} category), ${bestCard.cardName} offers the best value with ${bestCard.displayValue} ${bestCard.rewardType}.</p>
                    ${bestCard.reasoning || generateReasoning(bestCard, merchantCat)}
                ` : 'Unable to determine best card.'}
            </div>
        </div>
        
        <!-- Detailed Comparison Table -->
        <div class="comparison-table-section">
            <h4 class="comparison-table-title">Side-by-Side Comparison</h4>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>Earn Rate</th>
                        <th>Reward Type</th>
                        <th>Est. Value</th>
                        <th>Decision Criteria</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add each card to the comparison table
    cardComparisons.forEach((cardData, index) => {
        const isBest = index === 0;
        const criteria = getDecisionCriteria(cardData, merchantCat);
        
        html += `
            <tr class="${isBest ? 'best-row' : ''}">
                <td class="card-name-cell">
                    ${isBest ? '<span class="best-badge-small">BEST</span>' : ''}
                    <div class="card-name">${cardData.cardName}</div>
                    <div class="card-issuer-small">${cardData.issuer}</div>
                </td>
                <td class="earn-rate-cell">
                    <span class="earn-rate">${cardData.displayValue}</span>
                </td>
                <td class="reward-type-cell">
                    <span class="reward-type-badge">${cardData.rewardType}</span>
                </td>
                <td class="value-cell">
                    <span class="value-amount">${cardData.estimatedValue || calculateEstimatedValue(cardData)}</span>
                </td>
                <td class="criteria-cell">
                    ${criteria}
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        <!-- Visual Comparison Chart -->
        <div class="visual-comparison-section">
            <h4 class="visual-title">Rewards Comparison</h4>
            <div class="rewards-chart">
    `;
    
    // Create visual bars for comparison
    const maxValue = Math.max(...cardComparisons.map(c => c.value));
    cardComparisons.forEach((cardData, index) => {
        const percentage = (cardData.value / maxValue) * 100;
        const isBest = index === 0;
        
        html += `
            <div class="reward-bar-item">
                <div class="reward-bar-label">
                    <span class="bar-card-name">${cardData.cardName}</span>
                    <span class="bar-value">${cardData.displayValue}</span>
                </div>
                <div class="reward-bar-container">
                    <div class="reward-bar ${isBest ? 'best-bar' : ''}" style="width: ${percentage}%">
                        <span class="bar-percentage">${cardData.rewardType}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Add optimal card suggestion if different from user's best card
    if (optimalCard && (!cardComparisons.length || optimalCard.name !== cardComparisons[0].cardName)) {
        html += `
            <div class="optimal-suggestion-section">
                <div class="optimal-header">
                    <div class="optimal-icon">✨</div>
                    <div class="optimal-title">Optimal Card for ${getMerchantCategory(domain)}</div>
                </div>
                <div class="optimal-card-display">
                    ${optimalCard.image ? 
                        `<img src="${optimalCard.image}" alt="${optimalCard.name}" class="optimal-card-image" onerror="this.style.display='none'">` :
                        `<div class="optimal-card-image" style="display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3);">💳</div>`
                    }
                    <div class="optimal-card-details">
                        <div class="optimal-card-name">${optimalCard.name}</div>
                        <div class="optimal-card-issuer">${optimalCard.issuer}</div>
                        <div class="optimal-benefits">
                            <span class="optimal-benefit-tag">${optimalCard.displayReward}</span>
                            ${optimalCard.benefits ? optimalCard.benefits.map(b => 
                                `<span class="optimal-benefit-tag">${b}</span>`
                            ).join('') : ''}
                        </div>
                    </div>
                </div>
                <div class="optimal-cta">
                    Don't have this card? <a href="#" class="optimal-cta-link" onclick="return false;">Learn more about applying</a>
                </div>
            </div>
        `;
    }
    
    resultContainer.innerHTML = html;
}

// Parse card comparisons from API response with proper points/cashback calculation
function parseCardComparisons(recommendation, selectedCards, domain) {
    const merchantCategory = getMerchantCategory(domain);
    const cardComparisons = [];
    
    // Comprehensive card reward structures
    const cardRewards = {
        // Chase Cards
        'chase_sapphire_preferred': { 
            dining: 3, travel: 3, streaming: 3, online_grocery: 3, other: 1,
            type: 'points', currency: 'Chase UR Points', pointValue: 1.25
        },
        'chase_sapphire_reserve': { 
            dining: 3, travel: 3, other: 1,
            type: 'points', currency: 'Chase UR Points', pointValue: 1.5
        },
        'chase_freedom_unlimited': {
            all: 1.5, dining: 3, drugstore: 3, travel_chase: 5,
            type: 'points', currency: 'Chase UR Points', pointValue: 1.0
        },
        'chase_freedom_flex': {
            rotating: 5, dining: 3, drugstore: 3, travel_chase: 5, other: 1,
            type: 'points', currency: 'Chase UR Points', pointValue: 1.0
        },
        
        // American Express Cards
        'amex_gold': {
            dining: 4, grocery: 4, flights: 3, other: 1,
            type: 'points', currency: 'Amex MR Points', pointValue: 2.0
        },
        'amex_platinum': {
            flights: 5, hotels: 5, other: 1,
            type: 'points', currency: 'Amex MR Points', pointValue: 2.0
        },
        'amex_green': {
            dining: 3, travel: 3, transit: 3, other: 1,
            type: 'points', currency: 'Amex MR Points', pointValue: 2.0
        },
        'amex_blue_cash_preferred': {
            grocery: 6, streaming: 6, transit: 3, gas: 3, other: 1,
            type: 'cashback'
        },
        'amex_blue_cash_everyday': {
            grocery: 3, online: 3, gas: 2, other: 1,
            type: 'cashback'
        },
        
        // Airline Co-branded Cards
        'amex_delta_gold': {
            delta: 2, dining: 2, grocery: 2, other: 1,
            type: 'miles', currency: 'Delta SkyMiles', pointValue: 1.2
        },
        'amex_delta_platinum': {
            delta: 3, hotels: 2, other: 1,
            type: 'miles', currency: 'Delta SkyMiles', pointValue: 1.2
        },
        'amex_delta_reserve': {
            delta: 3, other: 1,
            type: 'miles', currency: 'Delta SkyMiles', pointValue: 1.2
        },
        'chase_united_explorer': {
            united: 2, dining: 2, hotels: 2, other: 1,
            type: 'miles', currency: 'United MileagePlus', pointValue: 1.3
        },
        'chase_southwest_plus': {
            southwest: 2, other: 1,
            type: 'points', currency: 'Southwest Points', pointValue: 1.5
        },
        'citi_aadvantage': {
            american: 2, gas: 2, dining: 2, other: 1,
            type: 'miles', currency: 'AAdvantage Miles', pointValue: 1.4
        },
        'barclays_aviator_red': {
            american: 2, other: 1,
            type: 'miles', currency: 'AAdvantage Miles', pointValue: 1.4
        },
        'jetblue_card': {
            jetblue: 3, dining: 2, grocery: 2, other: 1,
            type: 'points', currency: 'JetBlue TrueBlue', pointValue: 1.3
        },
        'alaska_airlines_visa': {
            alaska: 3, other: 1,
            type: 'miles', currency: 'Alaska Miles', pointValue: 1.8
        },
        
        // Hotel Co-branded Cards
        'amex_hilton': {
            hilton: 7, gas: 5, grocery: 5, dining: 5, other: 3,
            type: 'points', currency: 'Hilton Honors', pointValue: 0.5
        },
        'amex_marriott': {
            marriott: 6, dining: 3, other: 2,
            type: 'points', currency: 'Marriott Bonvoy', pointValue: 0.8
        },
        'chase_hyatt': {
            hyatt: 4, dining: 2, gym: 2, other: 1,
            type: 'points', currency: 'World of Hyatt', pointValue: 1.7
        },
        'chase_ihg_premier': {
            ihg: 5, gas: 2, grocery: 2, dining: 2, other: 1,
            type: 'points', currency: 'IHG Rewards', pointValue: 0.6
        },
        
        // Capital One Cards
        'capital_one_savor': {
            dining: 4, entertainment: 4, streaming: 4, grocery: 3, other: 1,
            type: 'cashback'
        },
        'capital_one_savor_one': {
            dining: 3, entertainment: 3, grocery: 3, other: 1,
            type: 'cashback'
        },
        'capital_one_venture': {
            all: 2,
            type: 'miles', currency: 'Capital One Miles', pointValue: 1.0
        },
        'capital_one_venture_x': {
            travel_portal: 10, hotels_flights: 5, all: 2,
            type: 'miles', currency: 'Capital One Miles', pointValue: 1.0
        },
        
        // Citi Cards
        'citi_double_cash': {
            all: 2,
            type: 'cashback'
        },
        'citi_custom_cash': {
            top_category: 5, other: 1,
            type: 'cashback'
        },
        'citi_premier': {
            dining: 3, gas: 3, travel: 3, grocery: 3, other: 1,
            type: 'points', currency: 'Citi ThankYou Points', pointValue: 1.0
        },
        
        // Other Cards
        'bilt_mastercard': {
            dining: 3, travel: 2, rent: 1, other: 1,
            type: 'points', currency: 'Bilt Points', pointValue: 2.0
        },
        'apple_card': {
            apple: 3, apple_pay: 2, other: 1,
            type: 'cashback'
        },
        'amazon_prime_visa': {
            amazon: 5, whole_foods: 5, dining: 2, gas: 2, other: 1,
            type: 'cashback'
        },
        'costco_anywhere': {
            gas: 4, dining: 3, travel: 3, costco: 2, other: 1,
            type: 'cashback'
        },
        'wells_fargo_active_cash': {
            all: 2,
            type: 'cashback'
        },
        'wells_fargo_autograph': {
            dining: 3, travel: 3, transit: 3, streaming: 3, gas: 3, other: 1,
            type: 'points', currency: 'Wells Fargo Points', pointValue: 1.0
        },
        'discover_it_cash': {
            rotating: 5, other: 1,
            type: 'cashback'
        },
        'us_bank_altitude_reserve': {
            mobile_wallet: 3, travel: 3, other: 1,
            type: 'points', currency: 'US Bank Points', pointValue: 1.5
        }
    };
    
    selectedCards.forEach(card => {
        const rewardStructure = cardRewards[card.id] || { other: 1, type: 'cashback' };
        let multiplier = 1;
        let value = 1;
        let displayValue = '';
        let rewardType = '';
        
        // Calculate multiplier based on merchant category
        if (rewardStructure.all) {
            multiplier = rewardStructure.all;
        } else if (rewardStructure[merchantCategory]) {
            multiplier = rewardStructure[merchantCategory];
        } else {
            multiplier = rewardStructure.other || 1;
        }
        
        // Calculate value based on type
        if (rewardStructure.type === 'points' || rewardStructure.type === 'mixed') {
            const pointValue = rewardStructure.pointValue || 1.0;
            value = multiplier * pointValue;
            displayValue = `${multiplier}x`;
            rewardType = rewardStructure.currency || 'Points';
        } else {
            // Cashback
            value = multiplier;
            displayValue = `${multiplier}%`;
            rewardType = 'Cash Back';
        }
        
        cardComparisons.push({
            cardName: card.name,
            cardId: card.id,
            issuer: card.issuer,
            multiplier: multiplier,
            value: value,
            displayValue: displayValue,
            rewardType: rewardType
        });
    });
    
    return cardComparisons;
}

// Determine merchant category based on domain
function getMerchantCategory(domain) {
    const domainLower = domain.toLowerCase();
    
    // Dining
    if (domainLower.includes('ubereats') || domainLower.includes('doordash') || 
        domainLower.includes('grubhub') || domainLower.includes('seamless') ||
        domainLower.includes('postmates') || domainLower.includes('restaurant')) {
        return 'dining';
    }
    
    // Travel
    if (domainLower.includes('expedia') || domainLower.includes('booking') ||
        domainLower.includes('airbnb') || domainLower.includes('kayak') ||
        domainLower.includes('hotels') || domainLower.includes('united') ||
        domainLower.includes('american') || domainLower.includes('delta')) {
        return 'travel';
    }
    
    // Grocery
    if (domainLower.includes('walmart') || domainLower.includes('target') ||
        domainLower.includes('kroger') || domainLower.includes('safeway') ||
        domainLower.includes('whole') || domainLower.includes('trader')) {
        return 'grocery';
    }
    
    // Streaming
    if (domainLower.includes('netflix') || domainLower.includes('spotify') ||
        domainLower.includes('hulu') || domainLower.includes('disney') ||
        domainLower.includes('hbo') || domainLower.includes('youtube')) {
        return 'streaming';
    }
    
    // Entertainment
    if (domainLower.includes('ticketmaster') || domainLower.includes('stubhub') ||
        domainLower.includes('cinema') || domainLower.includes('theater')) {
        return 'entertainment';
    }
    
    // Gas
    if (domainLower.includes('shell') || domainLower.includes('exxon') ||
        domainLower.includes('chevron') || domainLower.includes('bp') ||
        domainLower.includes('speedway')) {
        return 'gas';
    }
    
    // Default
    return 'other';
}

// Parse optimal card recommendation from API response
function parseOptimalCard(recommendation, domain) {
    const merchantCategory = getMerchantCategory(domain);
    
    // Optimal cards by category (this would come from API)
    const optimalByCategory = {
        dining: { 
            name: "American Express Gold Card", 
            issuer: "American Express",
            image: "images/amex_gold.png",
            displayReward: "4x MR Points",
            benefits: ["$120 Uber credits", "$120 dining credits", "No foreign fees"]
        },
        travel: {
            name: "Chase Sapphire Reserve",
            issuer: "Chase",
            image: "images/chase_sapphire_reserve.png",
            displayReward: "3x UR Points + 50% boost",
            benefits: ["$300 travel credit", "Lounge access", "Travel insurance"]
        },
        grocery: {
            name: "American Express Gold Card",
            issuer: "American Express",
            image: "images/amex_gold.png",
            displayReward: "4x MR Points",
            benefits: ["Up to $25k/year", "Dining credits", "No foreign fees"]
        },
        gas: {
            name: "Costco Anywhere Visa",
            issuer: "Citi",
            image: "images/costco_anywhere.png",
            displayReward: "4% Cash Back",
            benefits: ["Up to $7k/year", "No annual fee*", "Costco membership"]
        },
        entertainment: {
            name: "Capital One SavorOne",
            issuer: "Capital One",
            image: "images/capital_one_savor_one.png",
            displayReward: "3% Cash Back",
            benefits: ["No annual fee", "No foreign fees", "Entertainment & dining"]
        },
        other: {
            name: "Citi Double Cash Card",
            issuer: "Citi",
            image: "images/citi_double_cash.png",
            displayReward: "2% Cash Back",
            benefits: ["1% when you buy", "1% when you pay", "No annual fee"]
        }
    };
    
    return optimalByCategory[merchantCategory] || optimalByCategory.other;
}

// Generate reasoning for why a card wins
function generateReasoning(card, merchantCategory) {
    const categoryNames = {
        dining: "dining and restaurants",
        travel: "travel and hotels",
        grocery: "grocery stores",
        gas: "gas stations",
        streaming: "streaming services",
        entertainment: "entertainment",
        other: "general purchases"
    };
    
    let reasoning = `<ul class="reasoning-list">`;
    
    if (card.rewardType.includes('Points') || card.rewardType.includes('Miles')) {
        reasoning += `<li>Earns ${card.displayValue} that can be worth ${card.estimatedValue || 'significant value'} when redeemed optimally</li>`;
        reasoning += `<li>Points/miles can be transferred to travel partners for potentially higher value</li>`;
    } else {
        reasoning += `<li>Earns ${card.displayValue} cash back with no redemption hassles</li>`;
        reasoning += `<li>Simple and straightforward rewards structure</li>`;
    }
    
    reasoning += `<li>Optimized for ${categoryNames[merchantCategory]} spending</li>`;
    reasoning += `</ul>`;
    
    return reasoning;
}

// Get decision criteria for a card
function getDecisionCriteria(card, merchantCategory) {
    const criteria = [];
    
    // Check if it's a category bonus
    if (card.multiplier > 1) {
        criteria.push(`✓ ${card.multiplier}x bonus category`);
    }
    
    // Check reward type
    if (card.rewardType.includes('Cash')) {
        criteria.push('✓ Simple cash back');
    } else if (card.rewardType.includes('Points')) {
        criteria.push('✓ Flexible points');
    } else if (card.rewardType.includes('Miles')) {
        criteria.push('✓ Airline miles');
    }
    
    // Check value proposition
    if (card.value >= 3) {
        criteria.push('✓ Premium rewards');
    } else if (card.value >= 2) {
        criteria.push('✓ Above average');
    } else {
        criteria.push('○ Base rewards');
    }
    
    return criteria.join('<br>');
}

// Calculate estimated value for display
function calculateEstimatedValue(card) {
    if (card.rewardType.includes('Cash')) {
        return `$${card.multiplier}/100 spent`;
    } else if (card.value) {
        const centsPerDollar = (card.value * 100).toFixed(1);
        return `~${centsPerDollar}¢ per $`;
    }
    return 'Varies';
}

// API Key Management Functions
async function loadApiKeyStatus() {
    const result = await chrome.storage.local.get('claudeApiKey');
    const apiKey = result.claudeApiKey;
    const statusIndicator = document.getElementById('apiStatusIndicator');
    const statusText = document.getElementById('apiStatusText');
    const keyValue = document.getElementById('apiKeyValue');
    
    if (apiKey && apiKey.length > 10) {
        statusIndicator.classList.remove('inactive');
        statusIndicator.classList.add('active');
        statusText.textContent = 'API key configured and ready';
        keyValue.textContent = '•'.repeat(20) + apiKey.slice(-4);
        keyValue.classList.add('active');
    } else {
        statusIndicator.classList.remove('active');
        statusIndicator.classList.add('inactive');
        statusText.textContent = 'No API key configured';
        keyValue.textContent = 'No API key set';
        keyValue.classList.remove('active');
    }
}

// Setup API key editing functionality
function setupApiKeyEditing() {
    const editBtn = document.getElementById('editApiKey');
    const displayRow = document.getElementById('apiKeyDisplay');
    const editContainer = document.getElementById('apiKeyEditContainer');
    const apiInput = document.getElementById('apiKeyInput');
    const saveBtn = document.getElementById('saveApiKey');
    const cancelBtn = document.getElementById('cancelApiKey');
    
    // Show edit mode
    editBtn.addEventListener('click', async () => {
        editContainer.classList.add('active');
        
        // Load current key if exists
        const result = await chrome.storage.local.get('claudeApiKey');
        if (result.claudeApiKey) {
            apiInput.value = result.claudeApiKey;
        }
        apiInput.focus();
    });
    
    // Cancel editing
    cancelBtn.addEventListener('click', () => {
        editContainer.classList.remove('active');
        apiInput.value = '';
    });
    
    // Save API key
    saveBtn.addEventListener('click', saveApiKey);
    
    // Allow Enter to save
    apiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveApiKey();
        }
    });
}

async function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const apiKey = input.value.trim();
    const editContainer = document.getElementById('apiKeyEditContainer');
    
    if (!apiKey) {
        alert('Please enter a valid API key');
        return;
    }
    
    // Basic validation - Claude API keys start with 'sk-ant-api'
    if (!apiKey.startsWith('sk-ant-api')) {
        alert('Invalid API key format. Claude keys start with "sk-ant-api"');
        return;
    }
    
    // Save the API key
    await chrome.storage.local.set({ claudeApiKey: apiKey });
    
    // Update display
    loadApiKeyStatus();
    
    // Switch back to display mode
    editContainer.classList.remove('active');
    input.value = '';
    
    // Show success briefly
    const statusText = document.getElementById('apiStatusText');
    const originalText = statusText.textContent;
    statusText.textContent = '✅ API key saved successfully!';
    setTimeout(() => {
        statusText.textContent = originalText;
    }, 2000);
}