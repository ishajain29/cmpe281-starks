Docker for Neo4j:

Pull docker image:

docker pull neo4j

Start an instance/Container for neo4j to deploy in aws:

docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    --volume=$HOME/neo4j/logs:/logs \
    --volume=$HOME/neo4j/import:/var/lib/neo4j/import \
    --volume=$HOME/neo4j/conf:/conf \
    neo4j 


Clustering of Neo4j in AWS:

Three node cluster created in AWS. Partition tolerence to be tested with Neo4j. Since Neo4j lands in 'CA' category of 'CAP' theorem, more research has to be done in this regard.

Neo4j is not fault tolerent. It can only exhibit consistency and availability.
