// movies.js
const movieData = [
{
  title: "In Time",
  image: "Images/intime.jpeg.webp",
  description: "In a future where time is literally currency and aging stops at 25, the wealthy can live forever while the poor must beg, borrow, or steal to survive. Will Salas, wrongly accused of murder, goes on the run with Sylvia Weis, a wealthy heiress, as they try to upend the corrupt system.",
  genres: ["Sci-Fi", "Action", "Thriller", "Drama"],
  link: "https://drive.google.com/file/d/1WPhggyz5hZbBSdEqQZepASs7ulnNON6N/preview"
},
{
  title: "Ready Player One",
  image: "Images/readyplayerone.jpeg",
  description: "In 2045, much of humanity escapes reality through the OASIS, a virtual reality universe created by James Halliday. When Halliday dies, he leaves behind a contest: whoever finds his hidden Easter Egg will inherit control of the OASIS and his fortune. Wade Watts joins the hunt, battling powerful corporations and rivals in a race for control.",
  genres: ["Sci-Fi", "Adventure", "Action", "Fantasy"],
  link: "https://drive.google.com/file/d/11Tufp84A9FfdhsVaDKzeAmYni_17asxk/preview"
},
{
  title: "Ford v Ferrari",
  image: "Images/fordvferrari.jpeg",
  description: "Based on a true story, Ford v Ferrari follows visionary car designer Carroll Shelby and fearless driver Ken Miles as they join forces to build a revolutionary race car for Ford Motor Company. Their mission: defeat Ferrari at the 1966 24 Hours of Le Mans, in a battle of innovation, determination, and speed.",
  genres: ["Drama", "Biography", "Sport", "Action"],
  link: ""
},
{
  title: "Fountain of Youth",
  image: "Images/fountainofyouth.jpeg",
  description: "Fountain of Youth follows two estranged siblings, Luke and Charlotte Purdue, who reunite on a globe-spanning adventure to find the legendary Fountain of Youth. When clues hidden in historic paintings lead them into a dangerous conspiracy and a secret society guarding the Fountain’s power, they must decide what they are willing to sacrifice for the truth.",
  genres: ["Fantasy", "Adventure", "Drama", "Action", "Mystery"],
  link: "https://drive.google.com/file/d/10GnK2QeeAymS2NbTYRNEgtd_UjYcZWVq/preview"
},
{
  title: "Maquia: When the Promised Flower Blooms",
  image: "Images/maquia.jpeg",
  description: "Maquia, a girl from the long-lived Iorph people, is separated from her clan after an invasion and stumbles upon an orphaned baby boy. She decides to raise him as her own, experiencing the joys and sorrows of motherhood as he grows older while she remains unchanged. The film explores themes of love, family, and the passage of time in a beautifully emotional fantasy tale.",
  genres: ["Anime", "Fantasy", "Drama", "Slice of Life"],
  link: "https://drive.google.com/file/d/1fYyWWoigzxOk8e44zbx8pGEgG43N_OrF/preview"
},
{
  title: "Suzume",
  image: "Images/suzume.jpeg",
  description: "Suzume follows a 17-year-old girl who discovers a mysterious door in a ruined area of Japan. When she opens it, a series of supernatural disasters begin to unfold across the country. With the help of Souta, a young man who guards the doors, Suzume embarks on a journey to close them and save Japan from catastrophe, while uncovering secrets about her own past.",
  genres: ["Anime", "Fantasy", "Adventure", "Drama", "Slice of Life"],
  link: "https://drive.google.com/file/d/1-albH7DfNbF3ClFFrlRkAuA0PzZWqEfH/preview"
},
{
    title: "Creed III",
    image: "Images/creed3 (1).jpeg",
    description: "In Creed III, Adonis Creed has been thriving in both his career and family life, but his world is shaken when a childhood friend and former boxing prodigy, Damian Anderson, resurfaces after serving time in prison. What begins as a reunion quickly turns into a rivalry, as Damian is eager to prove himself and take everything Adonis has built. To settle their differences, Adonis must face Damian in the ring, confronting his past and fighting for his future.",
    genres: ["Drama", "Sports", "Action"],
    link: "https://drive.google.com/file/d/1iGi44c3ZOXCKNyIvr7zT2cujh9Odkf0q/preview"
},
{
    title: "A Silent Voice",
    image: "Images/asilentvoice .jpeg",
    description: "A Silent Voice follows Shōya Ishida, a former bully burdened by guilt, who tries to reconnect with Shōko Nishimiya, a deaf girl he tormented in elementary school. Ostracized by classmates himself, he must confront his past behaviour and seek forgiveness, rebuilding relationships and finding meaning in the process.",
    genres: ["Animation", "Drama", "Romance", "Slice of Life"],
    link: "https://drive.google.com/file/d/1xbDRbsTIir88DJsKmk0wZZKkp3IWl3Ku/preview"
},
{
    title: "The Tunnel to Summer",
    image: "Images/tunnel.jpeg",
    description: "Kaoru Tono stumbles upon a mysterious tunnel rumored to grant any wish, though at a cost: time passes differently inside. When he meets Anzu Hanashiro, a new transfer student, the two team up to explore the tunnel’s secrets. As they wrestle with their desires and regrets, they must decide what they are willing to sacrifice for a chance at happiness.",
    genres: ["Animation", "Drama", "Romance", "Fantasy", "Slice of Life"],
    link: "https://drive.google.com/file/d/1E0v3XxdchD79PuXtiUCdx0F4vaj50TwK/preview "
},
{
    title: "I Want to Eat Your Pancreas",
    image: "Images/pancreas.jpeg",
    description: "An introverted high school boy discovers the diary of his popular classmate, Sakura Yamauchi, and learns she is secretly suffering from a terminal pancreatic illness. Despite their differences, the two form an unexpected friendship that changes both their lives forever. As they share bittersweet moments together, he learns the value of living fully, even in the face of loss.",
    genres: ["Animation", "Drama", "Romance", "Slice of Life"],
    link: "https://drive.google.com/file/d/1N4GNzR3572bpCNiNmSBV2FK7R1_M4BPy/preview  "
},
{
    title: "Moana 2",
    image: "Images/moana2.jpeg",
    description: "Three years after her adventure with Maui and restoring Te Fiti, Moana, now Motunui’s tautai (master wayfinder), discovers that the island which once connected all lands has sunk. When a curse threatens her people’s survival, she assembles a crew to journey across the seas to raise the lost island and restore connection among her people—facing storms, loss, and sacrifice along the way.",
    genres: ["Animation", "Adventure", "Fantasy", "Family"],
    link: "https://drive.google.com/file/d/1mPfGxkiAdrPeBIddcZzhKk8LEr5dzx-0/preview"
},
{
    title: "Sinners",
    image: "Images/sinners.jpeg",
    description: "Set in 1932 Mississippi, Sinners follows twin brothers Smoke and Stack (both played by Michael B. Jordan), who return from working in Chicago to open a Black-owned juke joint in their hometown. Their plans collide with supernatural horror, Jim Crow oppression, music, and the weight of history in a Southern Gothic telling of identity, return, and evil unseen.",
    genres: ["Horror", "Supernatural", "Drama", "Musical"],
    link: "https://drive.google.com/file/d/1cJSi1Y8HiEy4EmSn2cYV5McVMd9GcTZK/preview"
},
{
    title: "Maze Runner:The death cure",
    image: "Images/dc.jpeg",
    description: "Maze Runner: The Death Cure follows Thomas and the surviving Gladers as they embark on their final mission—to break into the legendary Last City, a stronghold controlled by WCKD. Inside, they face the deadliest maze of all in a desperate attempt to rescue their friends and find a cure for the deadly Flare virus. Loyalties are tested, sacrifices are made, and the fate of humanity hangs in the balance.",
    genres: ["Adventure", "Action","Sci-Fi","Thriller"],
    link: "https://drive.google.com/file/d/1s3Nfb0f20kyS39nPoyvxMDgLPzYmE_Ya/preview"
  },
{
    title: "Maze Runner:The scorch trials",
    image: "Images/st.jpeg",
    description: "Maze Runner: The Scorch Trials continues Thomas and the Gladers’ journey after escaping the Maze. They face a harsh, desolate landscape known as the Scorch, full of dangerous terrain, hostile humans, and mysterious creatures. As they uncover the truth about the organization WCKD, Thomas must lead his friends through betrayal, survival, and impossible choices to protect those he cares about. ",
    genres: ["Adventure", "Action","Thriller","Sci-Fi"],
    link: "https://drive.google.com/file/d/1oM--0OMZxRbUOKGLoWvYTTycKsgKrnP0/preview "
  },
{
    title: "Weathering with you",
    image: "Images/wwy.jpeg",
    description: "Weathering With You follows Hodaka, a runaway teen in Tokyo, who meets Hina, a girl with the mysterious ability to control the weather. As they grow close, Hina’s gift becomes both a blessing and a curse, forcing them to make difficult choices about love, sacrifice, and the balance between human desires and nature’s power. ",
    genres: ["Adventure","Animation",  "Romance","Fantasy","Slice of Life"],
    link: "https://drive.google.com/file/d/1l_Rts-j3QIKjtPkv-I1AftrVheqJmRyk/preview "
  },
{
    title: "Free Guy",
    image: "Images/fg.webp",
    description: "Free Guy follows Guy, a cheerful bank teller who discovers he is actually a background character in an open-world video game. As he becomes self-aware, Guy takes control of his destiny, teaming up with a real-world player to save the game from being shut down. Along the way, he learns what it means to be a true hero in both the digital and real worlds. ",
    genres: ["Adventure", "Comedy","Action","Fantasy"],
    link: "https://drive.google.com/file/d/1cRVyAhKAWqFxwnUW21mJrjIWkqWeh0hk/preview"
  },
  {
    title: "The Maze Runner",
    image: "Images/cover7 .jpeg",
    description: "Thomas loses his memory and finds himself trapped in a massive maze called the Glade. He and his friends try to escape from the maze and eventually learn that they are subjects of an experiment. ",
    genres: ["Adventure", "Action", "Thriller", "Mystery", "Sci-Fi"],
    link: "https://drive.google.com/file/d/1EDZUjrtc-fCUeaLyEx-Bes_wchTs-JAV/preview"
  }, 
  {
    title: "Your Name",
    image: "Images/Cover3.jpeg",
    description: "Your Name tells the story of two teenagers, Mitsuha and Taki, who mysteriously begin swapping bodies despite living in different places. As they navigate each other’s lives, they form a deep connection that transcends time and distance. When a looming disaster threatens Mitsuha’s town, the two race against fate to save each other and uncover the truth behind their strange bond.",
    genres: ["Animation", "Slice of Life","Romance", "Fantasy", "Drama"],
    link: "https://drive.google.com/file/d/1apFvCPgIKV4t3y27dlzwCUqqMRI8UjJz/preview"
  },
  {
    title: "The Life List",
    image: "Images/Cover1.jpeg",
    description: "The Life List follows Alex Rose, who, after her mother’s death, must complete a set of childhood aspirations she wrote at age 13 to inherit her estate. Guided by her mother’s sentimental video messages and aided by the estate’s executor, Brad, Alex embarks on a transformative year of stand-up comedy, family reunions, romantic missteps, and rediscovery—ultimately learning what truly matters and finding unexpected love. ",
    genres: ["Drama", "Family", "Adventure"],
    link: "https://drive.google.com/file/d/12tRqoJ9sXycE7RODnlxu11HVR7wcZbtL/preview"
  },
{
    title: "Konosuba",
    image: "Images/k.jpeg",
    description: "Kazuma and his friends set out to help the village of the Crimson demons when they're attacked by the frightening demon king's army. ",
    genres: ["Adventure","Animation", "Comedy","Fantasy","Isekai"],
    link: "https://drive.google.com/file/d/1lgfFpM0JpatalyaOSyyHflhzUD0JwbgI/preview "
  },
  {
    title: "Power Rangers",
    image: "Images/Cover2.jpeg",
    description: "Power Rangers (2017) follows five ordinary teenagers who discover ancient Power Coins that grant them extraordinary abilities. Guided by the mentor Zordon, they must learn to work together and embrace their roles as the Power Rangers to stop the villainous Rita Repulsa from destroying the world. ",
    genres: ["Action", "Sci-Fi", "Adventure"],
    link: "https://drive.google.com/file/d/17looZTle9cX9De1f6gN5QUcBhopDoKvx/preview"
  },
  {
    title: "Fight or Flight",
    image: "Images/fof.jpeg",
    description: "A mercenary takes on the job of tracking a high-value asset known only as \"The Ghost\" on an international flight. Realizing the plane is filled with assassins assigned to kill them both, the pair must work together in a fight for their lives.",
    genres: ["Action", "Thriller"],
    link: "https://drive.google.com/file/d/1NOmVKcv5iDy3cEDIvgTb9j9801lQTQc1/preview"
  },
  {
    title: "The Swimmers",
    image: "Images/ts.jpeg",
    description: "Two Syrian sisters flee their war-torn home in Damascus, swim for hours in choppy Mediterranean seas to reach Greece as asylum seekers before going on to compete at the Rio Olympic Games.",
    genres: ["Adventure", "Bibliography", "Drama"],
    link: "https://drive.google.com/file/d/1JkUj0q7_zGIiHegH40aDmYQW8wxmW5mR/preview"
  },
  {
    title: "The Kissing Booth",
    image: "Images/tkb.jpeg",
    description: "A high school student finds herself face-to-face with her long-term crush when she signs up to run a kissing booth at the spring carnival.",
    genres: ["Romance", "Comedy"],
    link: "https://drive.google.com/file/d/1KeGGJbvLWWEXeZH_CAOotK75Wdi-yR7C/preview"
  },
{
    title: "After",
    image: "Images/after.jpeg",
    description: "After follows Tessa Young, a dedicated student and loyal girlfriend, whose life changes when she enters university. There, she meets Hardin Scott, a mysterious and rebellious young man who challenges her beliefs and emotions. As their worlds collide, Tessa finds herself torn between who she was and who she is becoming.",
    genres: ["Romance", "Drama"],
    link: "https://drive.google.com/file/d/11vS3r_-J0AbrJ7ZiHxomcUbffT42JZIr/preview "
  },
  {
    title: "Five Feet Apart",
    image: "Images/fivefeetapart.jpeg",
    description: "Five Feet Apart tells the story of Stella and Will, two teenagers with cystic fibrosis whose lives depend on staying physically distant from each other. Despite their illness forcing them apart, they fall deeply in love and struggle to balance their longing for closeness with the rules that keep them alive.",
    genres: ["Romance", "Drama"],
    link: "https://drive.google.com/file/d/1rASZy-kNF1YFeIisURyBQC4DWIb7tZhO/preview"
  },
  {
    title: "American Pie: Girls' Rules",
    image: "Images/girlsrules.jpeg",
    description: "In American Pie: Girls' Rules, a new generation of girls at East Great Falls High decide to take control of their senior year. With friendships, love, and teenage chaos at the center, they flip the script on classic high school traditions, bringing humor and heart to the iconic comedy franchise.",
    genres: ["Comedy", "Teen"],
    link: "https://drive.google.com/file/d/124RCrNC-ezCjsQMmvziLK9yqM1qfNtr3/preview  "
  },





];
