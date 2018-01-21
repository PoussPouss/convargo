'use strict';

//list of truckers
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];



//list of current shippings
//useful for ALL steps
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];




//list of actors for payment
//useful from step 5
const actors =
[{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];


function findTruckByID(idTruck) {
  for (var i = 0; i < truckers.length; i++) {
    var truck = truckers[i]
    if (truck.id == idTruck) {
      return truck
    }
  }
  return null // in case if the id isn't found
}


// be careful
function calculatePercent(value, percent) {
  return value / 100 * percent
}

// Follows conditions of the step 01 for calculing the price
function calculatePrice(delivery,truck){
  var pricePerKm = truck.pricePerKm
  var pricePerVolume = truck.pricePerVolume
  var distance = delivery.distance
  var volume = delivery.volume
  var price = pricePerKm * distance + pricePerVolume * volume
  delivery.price = price
}

// Follows conditions of the step 2 for subsrtracting the discount in terms of the volumes
function calculateDiscount(delivery,truck){
  var discount = 0
  var volume = delivery.volume
  var pricePerVolume = truck.pricePerVolume
  if (volume > 25) {
    discount = calculatePercent(pricePerVolume * volume, 50)
  } else if (volume > 10) {
    discount = calculatePercent(pricePerVolume * volume, 30)
  } else if (volume > 5) {
    discount = calculatePercent(pricePerVolume * volume, 10)
  }
  delivery.price -= discount
}

// Follows conditions of the step 3 for adding commission
function calculateCommission(delivery){
  var price = delivery.price
  var commission = delivery.commission
  var commissionPrice = calculatePercent(price, 30) // 30% price
  var distance = delivery.distance

  commission.insurance = commissionPrice / 2 // half of commission
  commission.treasury = Math.ceil(distance / 500) // 1 euro by 500Km range
  commission.convargo = commissionPrice - (commission.insurance + commission.treasury) // the rest
}

function calculateReduction(delivery){
  if (delivery.deductibleReduction) {
    delivery+= volume
  }
}

// Allows to update the delivery price for each delivery
function updatePrice() {
  for (var i in deliveries) {
    var delivery = deliveries[i]
    var truckAssociated = findTruckByID(delivery.truckerId)
    if (truckAssociated == null){
      // STEP 01
      calculatePrice(delivery,truckAssociated)

      // STEP 02
      calculateDiscount(delivery,truckAssociated)

      // STEP 03
      calculateCommission(delivery)

      // STEP 04
      calculateReduction(delivery)
    }else{
      // In case where the object doesn't exist
      console.log("ERROR - Truck not found")
    }
  }
  console.log(deliveries)
}

// Returns the "delivery" in terms of the id passed in parameter
function findDeliveryByID(idDelivery) {
  for (var i in deliveries) {
    var delivery = deliveries[i]
    if (delivery.id == idDelivery) {
      return delivery
    }
  }
  return null // in case if the id isn't found
}

// Attributes payments between delevry and actor of this delivery
function attributatePaymentPeople(actor, delivery) {
  for (var i in actor.payment) {
    var people = actor.payment[i]
    // Each people receives or pays an amount differents
    switch (people.who) {
      case "shipper":
        people.amount = delivery.price
        break;
      case "trucker":
        people.amount = delivery.price - calculatePercent(delivery.price, 30)
        if(delivery.deductibleReduction){
          people.amount -= volume // corresponding at the reduction
        }
        break;
      case "insurance":
        people.amount = delivery.commission.insurance
        break;
      case "treasury":
        people.amount = delivery.commission.treasury
        break;
      case "convargo":
        people.amount = delivery.commission.convargo
        break;
    }
  }
}

// Allows to update the payment
function updatePayment() {
  for (var i in actors) {
    var actor = actors[i]
    var delivery = findDeliveryByID(actor.deliveryId)
    if (delivery != null) {
      attributatePaymentPeople(actor, delivery)
    } else {
      console.log("ERROR - delivery not found")
    }
  }

}


updatePrice()
updatePayment()
