#Managing Partition Tolerance

This can be done by using the feature present in MongoDB known as - writeConcern with parameters w and wstimeout. 'w' here ensures that write is done on the n number of servers.
By updating this to each insertion of the document, write can be performed with ease.

db.products.insert(
   { item: "envelopes", qty : 100, type: "Clasp" },
   { writeConcern: { w: 2, wtimeout: 5000 } }
)
