const orgName = "ChrisReferenceProjects"; // Replace with the name of the organization you want to retrieve repositories from
const accessToken = "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"; 
const username = "christophe-havard-sonarsource"; 

const { Octokit } = require("octokit");
const octokit = new Octokit({
    auth: accessToken
  });

  async function fetchRepos(){
  await octokit.request('GET /orgs/' + orgName + '/repos', {
    org: orgName
  }).then(async response => {
    var repos = response.data;
    console.log("FOUND " + repos.length + " repos in GitHub");
    await createSonarCloudProjects(repos);
  }
  );
}

async function createSonarCloudProjects(repos){
  console.log("creating " + repos.length + " projects ");
  
  var api_create_project= "https://sonarcloud.io/api/projects/create?";
  
  for(const element of repos){
    console.log("creating project " + element.name);
    await postData(api_create_project, {'name': element.name, 'organization': "myorgforatest", 'project': element.full_name.replace('/','--'), 'visibility': 'public'})
      .then(res => console.log("Project " + element.full_name.replace('/','--') + " --> " + res.statusText));
    console.log("Creating project " + element.full_name.replace('/','--') + " in SonarCloud...");
  }

}

async function postData(url = '', data = {}) {
  const response = await fetch(url + "name=" + data.name+"&organization=" + data.organization+"&project=" + data.project + "&visibility="+data.visibility, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 843aa231e7016b3a58d5eff976b6b18163637e7b'
    }
     
  });
  return response.json();

  
}




fetchRepos();

 