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

