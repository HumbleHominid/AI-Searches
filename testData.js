module.exports = [
  {
    assert: {
      aStar: {
        path: "Invalid starting city.",
        cost: 0
      },
      generic: {
        path: "Invalid starting city.",
        cost: 0
      }
    }
  },
  {
    start: "Jordan",
    assert: {
      aStar: {
        path: "Invalid ending city.",
        cost: 0
      },
      generic: {
        path: "Invalid ending city.",
        cost: 0
      }
    }
  },
  {
    goal: "Whitefish",
    assert: {
      aStar: {
        path: "Invalid starting city.",
        cost: 0
      },
      generic: {
        path: "Invalid starting city.",
        cost: 0
      }
    }
  },
  {
    start: "Jordan",
    goal: "Whitefish",
    assert: {
      aStar: {
        path: "Jordan,Lewistown,GreatFalls,Shelby,Whitefish",
        cost: 462
      },
      generic: {
        path: "Jordan,MilesCity,Billings,Lewistown,Malta,Havre,GreatFalls,Shelby,Whitefish",
        cost: 922
      }
    }
  },
  {
    start: "Invalid",
    goal: "Whitefish",
    assert: {
      aStar: {
        path: "Invalid starting city.",
        cost: 0
      },
      generic: {
        path: "Invalid starting city.",
        cost: 0
      }
    }
  },
  {
    start: "Jordan",
    goal: "Invalid",
    assert: {
      aStar: {
        path: "Invalid ending city.",
        cost: 0
      },
      generic: {
        path: "Invalid ending city.",
        cost: 0
      }
    }
  },
  {
    start: "Jordan",
    goal: "Polson",
    assert: {
      aStar: {
        path: "Jordan,Lewistown,GreatFalls,Helena,Missoula,Polson",
        cost: 503
      },
      generic: {
        path: "Jordan,MilesCity,Billings,Lewistown,Malta,Havre,GreatFalls,Shelby,Whitefish,Kalispell,Polson",
        cost: 981
      }
    }
  },
  {
    start: "Jordan",
    goal: "Jordan",
    assert: {
      aStar: {
        path: "Jordan",
        cost: 0
      },
      generic: {
        path: "Jordan",
        cost: 0
      }
    }
  },
  {
    start: "Jordan",
    goal: "Dillon",
    assert: {
      aStar: {
        path: "Jordan,Lewistown,GreatFalls,Helena,Butte,Dillon",
        cost: 442
      },
      generic: {
        path: "Jordan,MilesCity,Billings,Lewistown,Malta,Havre,GreatFalls,Shelby,Whitefish,Kalispell,Polson,Missoula,Butte,Dillon",
        cost: 1227
      }
    }
  },
  {
    start: "Lewistown",
    goal: "GreatFalls",
    assert: {
      aStar: {
        path: "Lewistown,GreatFalls",
        cost: 106
      },
      generic: {
        path: "Lewistown,Jordan,MilesCity,Billings,Livingston,Bozeman,Helena,GreatFalls",
        cost: 681
      }
    }
  }
];
