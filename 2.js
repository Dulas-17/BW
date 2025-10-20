// series.js
const seriesData = [
{
  title: "86 Eighty-Six (S1)",
  image: "Images/86.jpeg",
  description: "In a dystopian war where the subjugated ‘Eighty-Six’ are forced to fight in unmanned drones while the privileged remain safe, a handler and her squad of Colorata must face betrayal, loss, and the truth behind the war.",
  genres: ["Action", "Sci-Fi", "Drama", "Mecha", "Anime"],
  episodes: [
    { title: "1 - Undertaker", link:"https://drive.google.com/file/d/1VYpulVgWkSLdLK18Dw3aWo53Nn8JFVkv/preview" },
    { title: "2 - Spearhead", link:"https://drive.google.com/file/d/1WxrFLJHNz_omBrm1xFm6JvISNH5nEfLP/preview" },
    { title: "3 - I Don’t Want to Die", link:"https://drive.google.com/file/d/1L4_jDFRIE7np06TCCF8nx1ImVMJ7zayj/preview" },
    { title: "4 - Real Name", link:"https://drive.google.com/file/d/1H2VHzvCs1dTtriMjc0UkUNFkkQ1atEF6/preview" },
    { title: "5 - I’m With You", link:"https://drive.google.com/file/d/1g13iRzxQ6hU_5MBEyOd9fuejlWphrUmE/preview" },
    { title: "6 - Through to the End", link:"https://drive.google.com/file/d/1Yk3ZQtDOguRFk8x5ibs6qwL8zZcpCE_Y/preview" },
    { title: "7 - Will You Remember Me?", link:"https://drive.google.com/file/d/17TQCsGVn4_1DgMw3m1D-9xBcAtJfsWya/preview" },
    { title: "8 - Let’s Go", link:"https://drive.google.com/file/d/1liqMPlxTsU3RqLMqM_uA6e9CNeOV4nmp/preview" },
    { title: "9 - Goodbye", link:"https://drive.google.com/file/d/1LOlpRmI-0YrQBmGX5l0-bJmhPRfMZHvn/preview" },
    { title: "10 - Thank You", link:"https://drive.google.com/file/d/1-_qB10tBwa1rdAN1FwcD-qhHzCbzjlou/preview" },
    { title: "11 - Here We Go", link:"https://drive.google.com/file/d/1YhGB81Cu20YOaOfo0d9oQ9omG0ycNQhs/preview" },
  ]
},
{
  title: "Voltron: Legendary Defender (S1)",
  image: "Images/voltron.jpeg",
  description: "Voltron: Legendary Defender follows five young pilots who discover robotic lions that combine to form the legendary defender, Voltron. Together, they must learn to work as a team to protect the universe from the evil Galra Empire and its ruthless leader, Emperor Zarkon.",
  genres: ["Action", "Adventure", "Mecha", "Sci-Fi", "Animation"],
  episodes: [
    { title: "1 - The Rise of Voltron", link: "https://drive.google.com/file/d/1Ekc1PqteVTCgKXcZK34xWMPgMazVJhPg/preview" },
    { title: "2 - Some Assembly Required", link: "https://drive.google.com/file/d/1Gsyf5dyHQcvOdKKeJ6kE6FROBRO3VlCo/preview" },
    { title: "3 - Return of the Gladiator", link: "https://drive.google.com/file/d/1UQQX5g1WXLtjOiSqL6sgJeEMhLRYQtg2/preview" },
    { title: "4 - Fall of the Castle of Lions", link: "https://drive.google.com/file/d/1O4CgpKE_ntJ7FUk8tS7qlhT-DEFIaTHN/preview" },
    { title: "5 - Tears of the Balmera", link: "https://drive.google.com/file/d/15kOo04LrE51EVMhmoZthwR9N1_3sAI2j/preview" },
  ]
},

{
  title: "Lucifer (S1)",
  image: "Images/lucifer1.jpeg",
  description: "Lucifer Morningstar, the Devil, abandons Hell and moves to Los Angeles where he opens a nightclub called Lux. Bored and unhappy with his life, he soon becomes a consultant for the LAPD, using his powers to punish criminals while exploring his own desire for redemption.",
  genres: ["Fantasy", "Drama", "Crime", "Mystery"],
  episodes: [
    { title: "1 - Pilot", link: "https://drive.google.com/file/d/1crB0KxvpTDCCUh38yMGAtQK_G2WDK6zC/preview" },
    { title: "2 - Lucifer, Stay. Good Devil.", link: "https://drive.google.com/file/d/1hy7R_RO0VtT8MuZDsVjnN07QyfNccy3E/preview" },
    { title: "3 - The Would-Be Prince of Darkness", link: "https://drive.google.com/file/d/1A-YORmZOtHX0hmn4gP4rlMOhX7z_eTWt/preview" },
    { title: "4 - Manly Whatnots", link: "https://drive.google.com/file/d/1CG4sgF5jzXSlpFRZAKEL4MxjSITu0hzx/preview" },
    { title: "5 - Sweet Kicks", link: "https://drive.google.com/file/d/1PhyfvP04rVFgEcOHiOpk2Y5r2rVJfNGW/preview" },
    { title: "6 - Favorite Son", link: "https://drive.google.com/file/d/16X3vBxo-PQIOmU_7GlqZX_ArDCfHP_yv/preview" },
    { title: "7 - Wingman", link: "https://drive.google.com/file/d/1qQ0GX1cXUrudVTUKRcCENbiA_SAE_MhC/preview" },
    { title: "8 - Et Tu, Doctor?", link: "https://drive.google.com/file/d/11yKmsq6KPgS0UeJPiMTTJlR0CRl-tIJa/preview" },
    { title: "9 - A Priest Walks into a Bar", link: "https://drive.google.com/file/d/1__ukfnygqElSl0sGzUgSr9KQqDEgSFWi/preview" },
    { title: "10 - Pops", link: "https://drive.google.com/file/d/17Uz-BwUv8tL_abNGzEGdl8I6CnG-PRAt/preview" },
    { title: "11 - St. Lucifer", link: "https://drive.google.com/file/d/1xFBvAbaKXIf1RJLA3JNm5Zhpq6Tt4i1Q/preview" },
    { title: "12 - #TeamLucifer", link: "https://drive.google.com/file/d/10VpPdph6tT_ZB4sY9trIsHCwu4UaXN_D/preview" },
    { title: "13 - Take Me Back to Hell", link: "https://drive.google.com/file/d/10yBvi3a9x8SjI9XX3u0pi6AaEQBUmEs-/preview" },
  ]
},



{
  title: "Demon Slayer (S4)",
  image: "Images/demonslayer_s4.jpeg",
  description: "Demon Slayer: Season 4 – Hashira Training Arc follows Tanjiro and his allies as they undergo special training with the Hashira in preparation for the final battles. While the Demon Slayer Corps strengthens their skills under each Hashira, the threat of Muzan Kibutsuji looms ever closer.",  
  genres: ["Action", "Fantasy", "Anime", "Adventure", "Shonen"],
  episodes: [
    { title: "1 - To Defeat Muzan Kibutsuji", link: "https://drive.google.com/file/d/1IxEM-hbNadZT59zXpKk4Sw-ToJBMD_2N/preview" },
    { title: "2 - Water Hashira Giyu Tomioka's Pain", link: "https://drive.google.com/file/d/1wqAF41pqqJURiEB-IrrtLsnFaXdKuViE/preview" },
    { title: "3 - Fully Recovered Tanjiro Joins the Hashira Training!!", link: "https://drive.google.com/file/d/1H3E4WugiJbwrsD2wG-FPy4vFd3tSMBAS/preview" },
    { title: "4 - To Bring a Smile to One's Face", link: "https://drive.google.com/file/d/1f83WyuWGyQ8AM7icAiKq6bq9Q7MnHmLN/preview" },
    { title: "5 - I Even Ate Demons...", link: "https://drive.google.com/file/d/1Sm1lDwTJOyWHGNhQ_0n7-HxlQE42nVu_/preview" },
    { title: "6 - The Strongest of the Demon Slayer Corps", link: "https://drive.google.com/file/d/18tTIB8KTDoZBrMo-bwGRiQpPC9v7Ewl3/preview" },
    { title: "7 - Stone Hashira Gyomei Himejima", link: "https://drive.google.com/file/d/1RVh6fTqQHhUIu1rW1aHy-NP2v6IojL3u/preview" },
    { title: "8 - The Hashira Unite", link: "https://drive.google.com/file/d/1mu8k6czz7K753AZyZFn5VlNUrlZDNFxQ/preview" }, 
  ]
},

{
  title: "The Flash (S3)",
  image: "Images/flash3.jpeg",
  description: "In Season 3 of The Flash, Barry Allen faces the consequences of creating Flashpoint, a new reality where familiar faces have changed lives. As Central City’s scarlet speedster, Barry must undo the ripple effects of his actions while battling new threats, including powerful metahumans and the mysterious speed god, Savitar.",
  genres: ["Action", "Drama", "Sci-Fi", "Superhero"],
  episodes: [
    { title: "1 - Flashpoint", link:"https://drive.google.com/file/d/1uu0ROXAg3b1UBzVA8du7YGLAog142KBR/preview " },
    { title: "2 - Paradox", link:"https://drive.google.com/file/d/1Fdt8tucRdmtTD3I-DSsExP4yZlAJhYOC/preview " },
    { title: "3 - Magenta", link:" https://drive.google.com/file/d/1PpMwnqzZPtf81pN9LdbGTdtYFKqrpyn_/preview" },
    { title: "4 - The New Rogues", link:"https://drive.google.com/file/d/1Z4cUGz2FjrUoqjGIPoFTo7mV2aKA4sa6/preview " },
    { title: "5 - Monster", link:"https://drive.google.com/file/d/1mIdlJachnqPioU7N5MPNkkcZO7A2X7zh/preview " },
    { title: "6 - Shade", link:"https://drive.google.com/file/d/1p-qtkc0tzo0pXW7SrwTwtQ18Iz9DXbuI/preview" },
    { title: "7 - Killer Frost", link:"https://drive.google.com/file/d/1G450Uwg5xD8tFrdco9hfIIFxVOy8ku0i/preview " },
    { title: "8 - Invasion!", link:"https://drive.google.com/file/d/1Ffk-fvSsIZAN14glqY2Sb8T9SvYPh-iG/preview " },
    { title: "9 - The Present", link:"https://drive.google.com/file/d/11axqiuPtyS-TR6_mcl5SPlxt2HaQGaJV/preview " },
    { title: "10 - Borrowing Problems from the Future", link:" https://drive.google.com/file/d/1q1IqvbWL8sPTbFgmOqg1B9Ej5huHJcRV/preview" },
  ]
},


{
  title: "Arcane (S1)",
  image: "Images/A.jpg",
  description: "Set in the utopian city of Piltover and the oppressed underground of Zaun, Arcane follows the origins of two iconic League of Legends champions, Vi and Jinx, and the power that will tear them apart.",
  genres: ["Drama", "Action", "Sci-Fi", "Steampunk", "Adventure"],
  episodes: [
    { title: "1 - Welcome to the Playground", link:"https://drive.google.com/file/d/1kjRAix1nSwnqaaLhTUo-Kq1dus6CwNbI/preview" },
    { title: "2 - Some Mysteries Are Better Left Unsolved", link:"https://drive.google.com/file/d/1kdjJlwn-0tDoNOsXjd2NIFqRR0dTE8nP/preview" },
    { title: "3 - The Base Violence Necessary for Change", link:"https://drive.google.com/file/d/1mnDSLVXGjmS-s1fgty_OWogtDflkVD4o/preview" },
    { title: "4 - Happy Progress Day!", link:"https://drive.google.com/file/d/1qMaJWviy7k5wWew-tTxzOsuKh3LFzMpv/preview" },
{ title: "5 - Everybody Wants to Be My Enemy", link: "https://drive.google.com/file/d/17F0_iI9corcp7Em_CacDlZVz-sMkBp68/preview" },
{ title: "6 - When These Walls Come Tumbling Down", link: "https://drive.google.com/file/d/1nc7DmfEXhzy9T8cjIgqpQzAjoLgbrgpa/preview" },
    { title: "7 - The Boy Savior", link: "https://drive.google.com/file/d/1Cqr-eKoMFU-AFKFliAWMEB1SUtAFkbYN/preview" },
{ title: "8 - Oil and Water", link: "https://drive.google.com/file/d/1eUXMIoEqC-TGb6eLwtSL7PVYETkv2zu9/preview" },
{ title: "9 - The Monster You Created", link: "https://drive.google.com/file/d/1i9goJ_8v5mTicq2-evoJRuMWUW917m44/preview" },
  ]
},

{
  title: "Attack On Titan (S1)",
  image: "Images/aot.jpeg",
  description: "Attack on Titan: Season 1 follows Eren Yeager, his adopted sister Mikasa, and their friend Armin as humanity fights for survival against giant humanoid creatures known as Titans. After their hometown is destroyed, Eren vows to eradicate every Titan. Joining the military, they uncover dark secrets about the Titans, face brutal battles, and confront the limits of human courage and resilience.",
  genres: ["Adventure","Shonen","Mystery","Action", "Thriller", "Anime"],
  episodes: [
    { title: "1 - To You, in 2000 Years", link:"https://drive.google.com/file/d/1dVytq0QiSTu8Kb7FvKubT8FzwZ6wrsbd/preview" },
    { title: "2 - That Day", link:"https://drive.google.com/file/d/1dXMt9HRbYFBqXj9lEUDq4GI7BQDiEtn9/preview" },
    { title: "3 - A Dim Light Amid Despair", link:"https://drive.google.com/file/d/1daZxMAOLS4yJQ9oTUGeqIEPzb9eirqzU/preview" },
    { title: "4 - The Night of the Closing Ceremony", link:"https://drive.google.com/file/d/1dbE2oinR8rKyz5U4K-dJ-0GybJnCVs_H/preview" },
    { title: "5 - First Battle", link:"https://drive.google.com/file/d/1dl9thmq8A3yaZ04PVXjyyjo4FZqLhWQ8/preview"},
  ]
},






{
  title:"Solo Leveling (S2)",
  image:"Images/sl.jpeg",
  description:"Solo Leveling: Season 2 – Arise from the Shadow continues Sung Jin-woo’s ascent as the Shadow Monarch. With his new powers hidden from the world, he faces even deadlier foes—including escaped S-Rank demons—and races to prevent a looming catastrophe brought by a mysterious hunter’s warning.",
  genres: ["Fantasy", "Action","Anime","Adventure","Shonen"],
  episodes: [
    { title: "1 - The Rise of the Monarch", link:"https://drive.google.com/file/d/1lFQb-JsOexeb7bxImzDu_c6ph0sxKc02/preview" }, 
    { title: "2 - S-Rank Threat", link:"https://drive.google.com/file/d/1lo9Hcl4aQccxR1vX-wES76uYEsSoSbeW/preview" },
    { title: "3 - Hidden Power", link:"https://drive.google.com/file/d/1m8hXrXPZiK2YnHbKmgRXrnC83zCCNXyJ/preview" },
    { title: "4 - The Warning", link:"https://drive.google.com/file/d/1mCsRmaqfZn268wrJ2CiFVXzUJD8lSTIO/preview" },
    { title: "5 - Catastrophe Approaches", link:"https://drive.google.com/file/d/1mNm_N_BxCnDQjbhPZqK-enVH__ANEJim/preview" },
    { title: "6 - Shadow Expansion", link:"https://drive.google.com/file/d/1mb166q9gHj-I1du82m6QYFbtPbT5lccW/preview" },
    { title: "7 - Confrontation", link:"https://drive.google.com/file/d/1psM6DkzzEsX_Bd43k-5di8v4lY3CsD-4/preview" },
    { title: "8 - Strategic Maneuvers", link:"https://drive.google.com/file/d/1pwj-L3DU4VBq38-t0yja7aq1xXIDzsSt/preview" },
    { title: "9 - Clash of Powers", link:"https://drive.google.com/file/d/1qBSowB6sAlY7ikQvaSfn4A1g8zVu6uc2/preview" },
    { title: "10 - The Ultimate Test", link:"https://drive.google.com/file/d/1q46E8f1dWL_bMOoqh1Lyz8P55zAEWHlU/preview" },
    { title: "11 - Monarch's Ascension", link:"https://drive.google.com/file/d/1qCibXrikL9gfOwXwYEDUQ1ELZmiQkxLs/preview" },
{ title: "12 - Shadows Unite", link: "https://drive.google.com/file/d/13uHlMpHRIm3uArIt45TqHC05TQMPd5vt/preview" },
{ title: "13 - Rise of the Monarch", link: "https://drive.google.com/file/d/13xBNXuulv94zEFRguxn2zNYUobeiBCSD/preview" },
  ]
},




 


  {
    title: "Highschool of the Dead",
    image: "Images/hd.jpeg",
    description: "Highschool of the Dead follows a group of high school students and their school nurse as they struggle to survive a sudden zombie apocalypse in Japan. Facing not only hordes of the undead but also human greed and fear, they must navigate danger, form alliances, and fight for survival while seeking safety and hope in a collapsing world. ",
    genres: ["Anime", "Action","Horror","Ecchi" ,"Adventure"],
    episodes: [
                      { title: "Episode 1", link: "https://drive.google.com/file/d/1du5EZvUQ7UDoG_GKNb6DO1P8VpQZ7N7l/preview  " },
                       { title: "Episode 2", link: "https://drive.google.com/file/d/1dv8qvFClTYJQB6oEBts0pveP7l1h5y1I/preview " },  
                       { title: "Episode 3", link: "https://drive.google.com/file/d/1mcrT9drcz4m23tB5WMXbT_0uLV3Lhza8/preview " },
{ title: "Episode 4", link: "https://drive.google.com/file/d/1mdo77A1fogb8AZs45Y4kEKBei4MMlbSo/preview " },
{ title: "Episode 5", link: "https://drive.google.com/file/d/1mfe3GorN0aD08-IWFTtbk6icRdLB3JVK/preview " }, 

    ]
  },

{
  title: "Wrong Way to Use Healing Magic",
  image: "Images/magic.jpeg",
  description: "Wrong Way to Use Healing Magic follows Kevin, a skilled healer who discovers that his magic works far differently than expected—healing others often comes with unpredictable and comedic consequences. As he navigates adventures, battles, and misunderstandings, Kevin learns to control his powers while facing both enemies and hilarious mishaps along the way.",
  genres: ["Adventure","Isekai","Comedy", "Anime", "Fantasy"],
  episodes: [
    { title: "1 - The Wrong Way", link: "https://drive.google.com/file/d/1bGS7uEp-48wpOBOqD0SmOWHGmdJ4sRBO/preview" },
    { title: "2 - Healing Mishap", link: "https://drive.google.com/file/d/1bhyk4q8kRkJZtMATBEJzUL02ELYG6MKk/preview" },
    { title: "3 - Unexpected Consequences", link: "https://drive.google.com/file/d/1c0EDAR5iMhfSnz3iX_8-0hbEHa4tg-zu/preview" },
    { title: "4 - Kevin’s Dilemma", link: "https://drive.google.com/file/d/1dzxT0RDut56FnysMA1HX-tm9catC6lQ9/preview" },
    { title: "5 - Controlling the Magic", link: "https://drive.google.com/file/d/1e-cXrZSX_GMx-2mj1tuuGBX9vl-mgA_j/preview"},
  ]
},

{
    title:"Scorpion (s1)",
    image:"Images/cover6.jpeg",
    description:"A team of brilliant misfits led by tech genius Walter O'Brien. Recruited by Homeland Security, they tackle high-risk threats using their unique skills to solve complex problems. As they face life-or-death missions, the team also learns to navigate personal relationships and the challenges of working together.",
    genres: ["Drama", "Action","Crime" ],
    episodes: [
                      { title: "Episode 1", link: "https://drive.google.com/file/d/1EJAx-1uee9V7MzE9M3hijPVFbvvNUfoN/preview " },                   
                   
    ]
  },



{
    title: "Good Doctor (s1)",
    image: "Images/cover5.jpeg",
    description: "Dr. Shaun Murphy, a young surgeon with autism and savant syndrome, as he navigates hospital life, proving his medical skills while facing personal and professional challenges.",
    genres: ["Drama", "Family", ],
    episodes: [
                      { title: "Episode 1", link: "https://drive.google.com/file/d/1DO8jLiL0mvJPTbteZuhkvcaeBwtjLA4I/preview " },
                      { title: "Episode 2", link: " https://drive.google.com/file/d/1Dm3Cqt4P55e0oD7ERBDNZF73mkV9nLrM/preview" },
                      { title: "Episode 3", link: "https://drive.google.com/file/d/1DoAejUM2Z3JgHj9wTbfVX-2x_g4pcBzA/preview " },
    ]
  },




{
  title: "Bleach: TYBW (S2)",
  image: "Images/cour2.jpeg",
  description: "A battle for the soul of the universe continues.",
  genres: ["Action", "Fantasy", "Anime","Shonen"],
  episodes: [
    { title: "1 - Soul Rebellion", link: "https://drive.google.com/file/d/10D0xtKf_CPz5ODJAiX2A5wfyCg57NcIg/preview" },
    { title: "2 - The Awakening", link: "https://drive.google.com/file/d/1-K6_2qaz1ZCz7u54FSnNX-hPq3qbqmZf/preview" },
    { title: "3 - Clash of Powers", link: "https://drive.google.com/file/d/1-TQNzstys6szmuu-5iPmnxmZ6-oznFc2/preview" },
    { title: "4 - Hidden Truths", link: "https://drive.google.com/file/d/19ln3Gofwt97mvsIod7x6X33UXXjYjxjb/preview" },
    { title: "5 - Final Stand", link: "https://drive.google.com/file/d/1A4cR5foWbEwlpz9QfXhPMvnwdAHqLIfM/preview" },
  ]
},
  


  



{
  title: " Miraculous Ladybug(S1)",
  image: "Images/ml.jpeg",
  description: " Miraculous Ladybug season 1 introduces Parisian teenagers Marinette Dupain-Cheng and Adrien Agreste, who are chosen to become the superheroes Ladybug and Cat Noir. They must work together to protect Paris from the villainous Hawk Moth, who uses his power to turn ordinary people with strong negative emotions into supervillains.",
  genres: ["Action", "Adventure", "Comedy", "Fantasy"],
  episodes: [
    { title: "Episode 1", link:"https://drive.google.com/file/d/1qKUoEQjxxHreSnvhL17mPlacN5tHvpH5/preview" },
    { title: "Episode 2", link:"https://drive.google.com/file/d/1qJiQOwE94sFPA1Nj9TVFvy4sBNI6rTdS/preview" },
  
  ]
},

{
  title: "Konosuba (S1)",
  image: "Images/Cover4.jpg",
  description: "Konosuba: Season 1 follows Kazuma Satou, a shut-in gamer who dies in a freak accident and is reincarnated in a fantasy world. Tasked with defeating the Demon King, he forms a dysfunctional party with the goddess Aqua, the mage Megumin, and the crusader Darkness. Together, their misadventures and comical failures highlight the humorous side of fantasy quests.",
  genres: ["Comedy", "Fantasy", "Isekai", "Anime","Adventure"],
  episodes: [
    { title: "1 - Kazuma's Death", link: "https://drive.google.com/file/d/110UyhRjYnSOomo3-9Wh30BZonjVHr7Nu/preview" },
    { title: "2 - Aqua's Arrival", link: "https://drive.google.com/file/d/1128cXGsLQ_wUcjls8hcZbfy-YbeRwChc/preview" },
    { title: "3 - Explosion Magic", link: "https://drive.google.com/file/d/110VFc93Wq49TvnsWq9AclCCsyt5scLSC/preview" },
    { title: "4 - Crusader Trouble", link: "https://drive.google.com/file/d/119B_PFF3wtTyQMu3pu4-rBpN1rrfI7dR/preview" },
    { title: "5 - Party Formation", link: "https://drive.google.com/file/d/116FV6qv7Hjdpkj4v7deuoactP-ee-T9A/preview" },
    { title: "6 - Dungeon Chaos", link: "https://drive.google.com/file/d/11A96GHkRYHQ1uwRwa4eMiVBxbqM5YcmA/preview" },
    { title: "7 - Stealing Trouble", link: "https://drive.google.com/file/d/11TiSpcFJr2N8r7GPyIGgmgy2tHfnQTtL/preview" },
    { title: "8 - Aqua's Mistake", link: "https://drive.google.com/file/d/11tAEoUZsUeQa4ja3-Nnt76nOKR2_w5wa/preview" },
    { title: "9 - Kazuma's Plan", link: "https://drive.google.com/file/d/11V8IleXjjcnlUAparkf44XBFEUwxK8Ou/preview" },
    { title: "10 - Party Success", link: "https://drive.google.com/file/d/11uRZmLQxY52jeIsQKiw6vf2d1jTiCBlr/preview" },
  ]
},

  {
    title: "Demon Slayer (s3)",
    image: "Images/DM.jpg",
    description: "A youth begins a quest to fight demons and save his sister after he finds his family slaughtered and his sister turned into a demon.",
    genres: ["Anime","Adventure","Action", "Fantasy","Shonen", ],
    episodes: [
                      { title: "1-someone's dream", link: "https://drive.google.com/file/d/1XLQqntnaNZcYTaXIu_McK1m2mo_LZv56/preview " },
                      { title: "2-yoriichi's blade", link: " https://drive.google.com/file/d/1XmN5vFRFNesn-gMaEKP7J12UCmJLXd0s/preview" },
{ title: "3 - A Sword from Over 300 Years Ago", link:"https://drive.google.com/file/d/1fLyBICgOlBLuW8otbs-fzeVBKGQnc3Bc/preview" },
{ title: "4 - Thank You, Tokito", link:"https://drive.google.com/file/d/1r64EtF5KA-GiB_EBuXeVOV00R73Vf5Gu/preview" },
{ title: "5 - Bright Red Blade", link:"https://drive.google.com/file/d/1m-C8yr_fVQmC1xvxg5QQYeVvxCJXbrAj/preview" },
{ title: "6 - Aren’t You Going to Become a Hashira?", link:"https://drive.google.com/file/d/1Hr9MyNGKlglO914FoAj0kLTsABRiznPu/preview" },
{ title: "7 - Awful Villain", link:"https://drive.google.com/file/d/1yeXCWDPO-z-H7mWYJDO6mW8sTWQB9aN6/preview" },
{ title: "8 - The Mu in Muichiro", link:"https://drive.google.com/file/d/1Y6Zd2V9s3NBSoeuNgDGbWiRi7KOPn8By/preview" },
{ title: "9 - Mist Hashira Muichiro Tokito", link:"https://drive.google.com/file/d/1Jhz49e0CkQ431JE4y527Omg4NSG0x5Oe/preview" },
{ title: "10 - Love Hashira Mitsuri Kanroji", link:"https://drive.google.com/file/d/1KLgEs3KvqPvnITYJ9HxvBlEyb38mFLMv/preview" },
{ title: "11 - A Connected Bond: Daybreak and First Light", link:"https://drive.google.com/file/d/1VnD-ABxwX5QjpLf56qLBn4WqWgIrgeCv/preview" },
                      
    ]
  },
  


  {
  title: "Wind Breaker (S1)",
  image: "Images/wb.jpeg",
  description: "Wind Breaker follows Haruka Sakura, a loner with a fiery temper and a love for fighting, as he transfers to Furin High School—a school notorious for its delinquent students. Contrary to his expectations, he discovers that the school's toughest students, known as Bofurin, are the town's protectors. As Haruka becomes entangled with Bofurin, he learns about their complex dynamics and faces challenges that test his strength and resolve.",
  genres: ["Anime","Action","Shonen","Drama","Comedy"],
  episodes: [
    { title: "1 - New Transfer", link: "https://drive.google.com/file/d/1az4hVHLA1vH_xrROD8VjiUPGEQESDm8Q/preview" },
    { title: "2 - Meeting Bofurin", link: "https://drive.google.com/file/d/1b1RR4bk-IHYHCF-7DsinO-5HSdqpcgOv/preview" },
    { title: "3 - First Fight", link: "https://drive.google.com/file/d/1cgQ2EGa8GZQNLQFHmH-NUlRkLztL8Rqj/preview" },
    { title: "4 - Unexpected Allies", link: "https://drive.google.com/file/d/1cngB9Nx1TysiG9W1_mpSRDSNbr3DivUX/preview" },
    { title: "5 - Bofurin Challenge", link: "https://drive.google.com/file/d/1cszf6WptniPQQgm-imt6Y7nkSGJRDVvE/preview" },
    { title: "6 - Rival Showdown", link: "https://drive.google.com/file/d/1cwwVcMVjL0VM_llB0R-ToTFAF0LtR4Qn/preview" },
    { title: "7 - Haruka’s Resolve", link: "https://drive.google.com/file/d/1d8c9U9vArqGV1ITvJ-7Tz2TL1FX0FUcL/preview" },
    { title: "8 - Strategy and Chaos", link: "https://drive.google.com/file/d/1dPNK8ZUwAGn_tVINxAcqU1mwoH63Ihlq/preview" },
    { title: "9 - Bofurin Test", link: "https://drive.google.com/file/d/1dOu_dLg4IM0IiclRsiK_vcQkMyNh2sXJ/preview" },
    { title: "10 - High Stakes", link: "https://drive.google.com/file/d/1dIqSmm6E55RfSKI8NoL6OHbZOM1bZN4F/preview" },
    { title: "11 - Secrets Revealed", link: "https://drive.google.com/file/d/1dGl4ZDsYWMcXH5NtSHN9EU9aHVZNMyTb/preview" },
    { title: "12 - Clash Intensifies", link: "https://drive.google.com/file/d/1d9BFwVuNt1RWSGDo8gmnO2_KiW3IH67z/preview" },
    { title: "13 - Showdown Finale", link: "https://drive.google.com/file/d/1d9fMQO6Db4SKvhJCaljOhyIjdt8ogF9i/preview" },
  ]
},





];
