Docker for Neo4j:

Pull docker image:

docker pull neo4j

Start an instance of neo4j:

docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --env=NEO4J_AUTH=none \
    --volume=$HOME/neo4j/data:/data \
    neo4j
