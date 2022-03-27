import React, { PureComponent } from 'react'
import axios from 'axios';
import ReactPaginate from 'react-paginate';

export class FirstComponents extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            tableData: [],
            orgtableData: [],
            perPage: 11,
            currentPage: 0,
            isAsc: true,
            search: '',
        }
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }


    handleSort() {
        let sorted;
        this.setState({
            isAsc: !this.state.isAsc
        })
        let stateCopy = JSON.parse(JSON.stringify(this.state.tableData));
        let nameArr = [];
        this.state.tableData.forEach((data, i) => {
            nameArr.push(`${data['name']}-${i}`)
        });
        if (this.state.isAsc) {
            sorted = nameArr.sort();
        } else {
            sorted = nameArr.sort((a, b) => {
                if (a > b)
                    return -1;
                if (a < b)
                    return 1;
                return 0;
            });
        }
        let sortedId = [];
        sorted.forEach((d) => {
            let id = d.split('-')[1];
            sortedId.push(id);
        })

        stateCopy.forEach((data, i) => {
            data['name'] = sorted[i].split('-')[0]
            data['email'] = stateCopy[Number([sortedId[i]])]['email']
            data['id'] = stateCopy[Number([sortedId[i]])]['id']
            data['body'] = stateCopy[Number([sortedId[i]])]['body']
        })

        this.setState({
            tableData: stateCopy,
        })
    }

    handleSearch() {
        let stateCopy = JSON.parse(JSON.stringify(this.state.tableData));
        const search = this.state.search.trim();
        const filtered = stateCopy.filter(f => {
            if (f['name'].trim().indexOf(search) != -1) {
                return f
            }
        });

        this.setState({
            tableData: filtered
        })
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData()
        });

    };

    loadMoreData() {
        const data = this.state.orgtableData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            tableData: slice
        })

    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        axios
            .get(`https://jsonplaceholder.typicode.com/comments`)
            .then(res => {

                var data = res.data;

                var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)


                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    orgtableData: res.data,
                    tableData: slice
                })
            });
    }

    render() {
        return (
            <div>
                <h1>React Table with Pagination, Sorting and Search</h1>
                <div>
                    <span>Search:</span>
                    <input placeholder='Search' value={this.state.search} onChange={(val) => this.setState({ search: val.target.value })} />
                    <button onClick={this.handleSearch}>Search</button>
                </div>

                <button onClick={this.handleSort}> {this.state.isAsc ? 'Ascending' : 'Descending'}</button>
                <table border="1">
                    <thead>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Body</th>

                    </thead>
                    <tbody>
                        {
                            this.state.tableData.map((tdata, i) => (
                                <tr>
                                    <td>{tdata.id}</td>
                                    <td>{tdata.name}</td>
                                    <td>{tdata.email}</td>
                                    <td>{tdata.body}</td>
                                </tr>

                            ))
                        }

                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"} />

            </div>
        )
    }
}

export default FirstComponents
