import type { Locale } from './i18n';

export interface OmContent {
  bio: string;
  filmLabel: string;
  portraitAlt: string;
  workAlt: string;
  workCaption: string;
  cv: { rubrik: string; poster: string[] }[];
}

// Verktitlar inom "citattecken" i CV:n översätts ALDRIG — endast beskrivande text.
export const OM: Record<Locale, OmContent> = {
  sv: {
    bio: 'Liv Due är en norsk-svensk konstnär som sedan 45 år är bosatt på Lidingö. Hon utbildade sig i keramik på Bergen Kunsthåndverksskole 1975–1978, fortsatte på Statens Kunstakademi i Oslo och därefter på Kungliga Konsthögskolan i Stockholm 1980–1986. Hon experimenterar gärna med olika material och arbetar med allt från kolteckning och stop-motion-film till måleri och smycken. Hennes offentliga skulpturer finns bland annat i Rågsved, Sickla, Lidingö, Göteborg, Arvika, Stenungsund och Karlstad.',
    filmLabel: 'Film',
    portraitAlt: 'Liv Due',
    workAlt: 'Liv Due hugger granitskulpturen Cellist',
    workCaption: 'Liv i arbete med "Cellist", granit, Karlstad.',
    cv: [
      {
        rubrik: 'Utbildning',
        poster: [
          'Kungliga Konsthögskolan, Stockholm — projektelev, 2012–2013',
          'Kungliga Konsthögskolan, Stockholm — skulptur, 1980–1986',
          'Statens Kunstakademi, Oslo — skulptur, 1978–1980',
          'Bergen Kunsthåndverksskole — keramik, 1975–1978',
        ],
      },
      {
        rubrik: 'Offentliga verk (i urval)',
        poster: [
          '"Basunerskans bön & Vassbåtskungens dröm", Storvretsvägen, Skogås, 2007',
          '"Cellist", granitskulptur framför Karlstads musikteater, 2001',
          'Sickla skola, amfiscen i sten 100 m², 2001',
          '"Trollveggen", Endrup Mølle, Danmark, 1999',
          'Torvlabyrint och stenring, Tom Tits Experiment, Södertälje, 1998',
          '"Tre Konger", Kankaanpää, Finland, 1998',
          '"Lutere", Rågsveds skola (med Hanns Karlewski), Stockholm, 1996',
          '"Til deg", Psykologiska institutionen, Göteborgs universitet, 1995',
          '"8 Stoler", Lidingö stadshuspark, 1995',
          '"Å komme gjennom", Stenungsunds torg, 1994',
        ],
      },
      {
        rubrik: 'Separatutställningar (i urval)',
        poster: [
          'Artspace, Varberg, 2016',
          'Fullersta Gård, Huddinge, 2010',
          'Det Gule Huset, Oslo, 2010',
          '"Hake och Due i centrum", Arvika, 2006',
          'Galleri Aniara, Sollentuna, 2016, 2003, 1998 och 1991',
          'Ark. Studio 87, Stockholm, 2002',
          'Konsthallen, Gamla Stan, Stockholm, 2001',
          'Galleri Söderlund, Stockholm, 1995',
          'Galleri Heer, Oslo, 1991 och 1988',
          'Galleri XIII, Stockholm, 1988',
        ],
      },
      {
        rubrik: 'Grupputställningar (i urval)',
        poster: [
          '"Aker Brygge Skulptur", Oslo, 2005',
          '"Kulturpark", Djurgården, Stockholm, 2003',
          '"Skulptur", Aker Brygge, Oslo, 2003',
          'Stockholms 750-årsjubileum, Skeppsholmen, 2002',
          'Grässkulptur, Lidingö centrum och Bergianska trädgården, 1998',
        ],
      },
      {
        rubrik: 'Installation & happening',
        poster: [
          'Aktör i "Prune Flat", "Northern Dark" och "Fast Cloud" av Robert Whitman, Moderna Museet, Stockholm, 1986 och 1989',
          '"Kärlekstunneln", installation, Kulturhuset, Stockholm, 1986',
        ],
      },
      {
        rubrik: 'Symposier (i urval)',
        poster: [
          'FluxAura, environmental art, Åbo, 2009',
          'Falu stensymposium, 2005',
          'Stensymposium, Bramming, Danmark, 1999',
          'Iron Pour Symposium, Budapest, 1999',
          'Torv- och skulptursymposium, Kankaanpää, Finland, 1997',
          'Culture, Identity and Development, Nairobi, Kenya, 1997',
          '"Symposium Norge", stensymposium, Larvik, 1994',
        ],
      },
      {
        rubrik: 'Undervisning (i urval)',
        poster: [
          'Strykejernet Kunstskole, gästlärare, Oslo, 2006',
          'Örebro konstskola, gästlärare, 2000',
          'Konstnärlig projektledare, grässkulpturutställningen, Lidingö, 1998',
          'Konstfack, form och färg, vikarie, Stockholm, 1991–1994',
          'Nyckelviksskolan, 1991',
        ],
      },
      {
        rubrik: 'Representerad hos (i urval)',
        poster: [
          'Statens Konstråd',
          'Stockholms läns landsting',
          'Norsk Kulturråd',
          'Statens Kunstakademi',
          'Lidingö, Sollentuna, Stenungsunds och Bardu kommun',
        ],
      },
    ],
  },

  no: {
    bio: 'Liv Due er en norsk-svensk kunstner som i 45 år har vært bosatt på Lidingö. Hun utdannet seg i keramikk ved Bergen Kunsthåndverksskole 1975–1978, fortsatte ved Statens Kunstakademi i Oslo og deretter ved Kungliga Konsthögskolan i Stockholm 1980–1986. Hun eksperimenterer gjerne med ulike materialer og arbeider med alt fra kulltegning og stop-motion-film til maleri og smykker. Hennes offentlige skulpturer finnes blant annet i Rågsved, Sickla, Lidingö, Göteborg, Arvika, Stenungsund og Karlstad.',
    filmLabel: 'Film',
    portraitAlt: 'Liv Due',
    workAlt: 'Liv Due hugger granittskulpturen Cellist',
    workCaption: 'Liv i arbeid med "Cellist", granitt, Karlstad.',
    cv: [
      {
        rubrik: 'Utdanning',
        poster: [
          'Kungliga Konsthögskolan, Stockholm — prosjektelev, 2012–2013',
          'Kungliga Konsthögskolan, Stockholm — skulptur, 1980–1986',
          'Statens Kunstakademi, Oslo — skulptur, 1978–1980',
          'Bergen Kunsthåndverksskole — keramikk, 1975–1978',
        ],
      },
      {
        rubrik: 'Offentlige arbeider (i utvalg)',
        poster: [
          '"Basunerskans bön & Vassbåtskungens dröm", Storvretsvägen, Skogås, 2007',
          '"Cellist", granittskulptur foran Karlstad musikkteater, 2001',
          'Sickla skole, amfiscene i stein 100 m², 2001',
          '"Trollveggen", Endrup Mølle, Danmark, 1999',
          'Torvlabyrint og steinring, Tom Tits Experiment, Södertälje, 1998',
          '"Tre Konger", Kankaanpää, Finland, 1998',
          '"Lutere", Rågsveds skole (med Hanns Karlewski), Stockholm, 1996',
          '"Til deg", Psykologisk institutt, Göteborgs universitet, 1995',
          '"8 Stoler", Lidingö rådhuspark, 1995',
          '"Å komme gjennom", Stenungsunds torg, 1994',
        ],
      },
      {
        rubrik: 'Separatutstillinger (i utvalg)',
        poster: [
          'Artspace, Varberg, 2016',
          'Fullersta Gård, Huddinge, 2010',
          'Det Gule Huset, Oslo, 2010',
          '"Hake och Due i centrum", Arvika, 2006',
          'Galleri Aniara, Sollentuna, 2016, 2003, 1998 og 1991',
          'Ark. Studio 87, Stockholm, 2002',
          'Konsthallen, Gamla Stan, Stockholm, 2001',
          'Galleri Söderlund, Stockholm, 1995',
          'Galleri Heer, Oslo, 1991 og 1988',
          'Galleri XIII, Stockholm, 1988',
        ],
      },
      {
        rubrik: 'Gruppeutstillinger (i utvalg)',
        poster: [
          '"Aker Brygge Skulptur", Oslo, 2005',
          '"Kulturpark", Djurgården, Stockholm, 2003',
          '"Skulptur", Aker Brygge, Oslo, 2003',
          'Stockholms 750-årsjubileum, Skeppsholmen, 2002',
          'Gressskulptur, Lidingö sentrum og Bergianska trädgården, 1998',
        ],
      },
      {
        rubrik: 'Installasjon & happening',
        poster: [
          'Aktør i "Prune Flat", "Northern Dark" og "Fast Cloud" av Robert Whitman, Moderna Museet, Stockholm, 1986 og 1989',
          '"Kärlekstunneln", installasjon, Kulturhuset, Stockholm, 1986',
        ],
      },
      {
        rubrik: 'Symposier (i utvalg)',
        poster: [
          'FluxAura, environmental art, Åbo, 2009',
          'Falun steinsymposium, 2005',
          'Steinsymposium, Bramming, Danmark, 1999',
          'Iron Pour Symposium, Budapest, 1999',
          'Torv- og skulptursymposium, Kankaanpää, Finland, 1997',
          'Culture, Identity and Development, Nairobi, Kenya, 1997',
          '"Symposium Norge", steinsymposium, Larvik, 1994',
        ],
      },
      {
        rubrik: 'Undervisning (i utvalg)',
        poster: [
          'Strykejernet Kunstskole, gjestelærer, Oslo, 2006',
          'Örebro konstskola, gjestelærer, 2000',
          'Kunstnerisk prosjektleder, gressskulpturutstillingen, Lidingö, 1998',
          'Konstfack, form og farge, vikar, Stockholm, 1991–1994',
          'Nyckelviksskolan, 1991',
        ],
      },
      {
        rubrik: 'Representert hos (i utvalg)',
        poster: [
          'Statens Konstråd',
          'Stockholms läns landsting',
          'Norsk Kulturråd',
          'Statens Kunstakademi',
          'Lidingö, Sollentuna, Stenungsunds og Bardu kommune',
        ],
      },
    ],
  },

  en: {
    bio: 'Liv Due is a Norwegian-Swedish artist who has lived on Lidingö, outside Stockholm, for 45 years. She trained in ceramics at Bergen Kunsthåndverksskole (1975–1978), continued at Statens Kunstakademi in Oslo, and then at Kungliga Konsthögskolan in Stockholm (1980–1986). She enjoys experimenting with different materials, working with everything from charcoal drawing and stop-motion film to painting and jewellery. Her public sculptures can be found in Rågsved, Sickla, Lidingö, Gothenburg, Arvika, Stenungsund and Karlstad, among other places.',
    filmLabel: 'Film',
    portraitAlt: 'Liv Due',
    workAlt: 'Liv Due carving the granite sculpture Cellist',
    workCaption: 'Liv at work on "Cellist", granite, Karlstad.',
    cv: [
      {
        rubrik: 'Education',
        poster: [
          'Kungliga Konsthögskolan, Stockholm — project student, 2012–2013',
          'Kungliga Konsthögskolan, Stockholm — sculpture, 1980–1986',
          'Statens Kunstakademi, Oslo — sculpture, 1978–1980',
          'Bergen Kunsthåndverksskole — ceramics, 1975–1978',
        ],
      },
      {
        rubrik: 'Public works (selection)',
        poster: [
          '"Basunerskans bön & Vassbåtskungens dröm", Storvretsvägen, Skogås, 2007',
          '"Cellist", granite sculpture in front of Karlstad Music Theatre, 2001',
          'Sickla School, stone amphitheatre, 100 m², 2001',
          '"Trollveggen", Endrup Mølle, Denmark, 1999',
          'Peat labyrinth and stone circle, Tom Tits Experiment, Södertälje, 1998',
          '"Tre Konger", Kankaanpää, Finland, 1998',
          '"Lutere", Rågsved School (with Hanns Karlewski), Stockholm, 1996',
          '"Til deg", Department of Psychology, University of Gothenburg, 1995',
          '"8 Stoler", Lidingö Town Hall Park, 1995',
          '"Å komme gjennom", Stenungsund Square, 1994',
        ],
      },
      {
        rubrik: 'Solo exhibitions (selection)',
        poster: [
          'Artspace, Varberg, 2016',
          'Fullersta Gård, Huddinge, 2010',
          'Det Gule Huset, Oslo, 2010',
          '"Hake och Due i centrum", Arvika, 2006',
          'Galleri Aniara, Sollentuna, 2016, 2003, 1998 and 1991',
          'Ark. Studio 87, Stockholm, 2002',
          'Konsthallen, Gamla Stan, Stockholm, 2001',
          'Galleri Söderlund, Stockholm, 1995',
          'Galleri Heer, Oslo, 1991 and 1988',
          'Galleri XIII, Stockholm, 1988',
        ],
      },
      {
        rubrik: 'Group exhibitions (selection)',
        poster: [
          '"Aker Brygge Skulptur", Oslo, 2005',
          '"Kulturpark", Djurgården, Stockholm, 2003',
          '"Skulptur", Aker Brygge, Oslo, 2003',
          'Stockholm 750th anniversary, Skeppsholmen, 2002',
          'Grass sculpture, Lidingö centre and the Bergius Botanic Garden, 1998',
        ],
      },
      {
        rubrik: 'Installation & happening',
        poster: [
          'Performer in "Prune Flat", "Northern Dark" and "Fast Cloud" by Robert Whitman, Moderna Museet, Stockholm, 1986 and 1989',
          '"Kärlekstunneln", installation, Kulturhuset, Stockholm, 1986',
        ],
      },
      {
        rubrik: 'Symposia (selection)',
        poster: [
          'FluxAura, environmental art, Turku, 2009',
          'Falun stone symposium, 2005',
          'Stone symposium, Bramming, Denmark, 1999',
          'Iron Pour Symposium, Budapest, 1999',
          'Peat and sculpture symposium, Kankaanpää, Finland, 1997',
          'Culture, Identity and Development, Nairobi, Kenya, 1997',
          '"Symposium Norge", stone symposium, Larvik, 1994',
        ],
      },
      {
        rubrik: 'Teaching (selection)',
        poster: [
          'Strykejernet Kunstskole, guest lecturer, Oslo, 2006',
          'Örebro konstskola, guest lecturer, 2000',
          'Artistic project leader, the grass sculpture exhibition, Lidingö, 1998',
          'Konstfack, form and colour, substitute teacher, Stockholm, 1991–1994',
          'Nyckelviksskolan, 1991',
        ],
      },
      {
        rubrik: 'Represented in (selection)',
        poster: [
          'Statens Konstråd (Swedish Public Art Agency)',
          'Stockholm County Council',
          'Norsk Kulturråd (Arts Council Norway)',
          'Statens Kunstakademi',
          'The municipalities of Lidingö, Sollentuna, Stenungsund and Bardu',
        ],
      },
    ],
  },
};
